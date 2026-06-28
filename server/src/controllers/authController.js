import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/db.js";

// Helper function to generate JWT (Accessible by both register & login)
const generateToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
};

// User registration
export const register = async (req, res) => {
    try {
        const { full_name, email, password, phone, role } = req.body;
        if (!full_name || !email || !password) {
            return res.status(400).json({ error: "Please provide name, email and password" });
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        // Corrected typo here (bcrypt instead of bcrpty)
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await prisma.user.create({
            data: {
                full_name,
                email,
                password: hashedPassword,
                phone,
                role: role || 'STUDENT', // Standard role enum value
            },
        });

        const token = generateToken(user.id);
        res.status(201).json({
            status: 'success',
            message: 'User registered successfully',
            token,
            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                role: user.role
            },
        });
    } catch (error) {
        console.error('Registration Error:', error);
        return res.status(500).json({ error: 'Internal server error during registration' });
    }
};

// User login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Please provide email and password' });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Incorrect email or password' });
        }

        const token = generateToken(user.id);
        res.status(200).json({
            status: 'success',
            message: 'User logged in successfully',
            token,
            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                role: user.role
            },
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ error: 'Internal server error during login' });
    }
};
