import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/db.js";

// Helper function to generate JWT
const generateToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
};

// Helper function to set JWT HTTP-Only Cookie
const setAuthCookie = (res, token) => {
    res.cookie('token', token, {
        httpOnly: true, // Prevents XSS script access
        secure: process.env.NODE_ENV === 'production', // Forces HTTPS in production
        sameSite: 'lax', // Protects against CSRF
        maxAge: 24 * 60 * 60 * 1000 // Cookie expires in 24 hours
    });
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

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await prisma.user.create({
            data: {
                full_name,
                email,
                password: hashedPassword,
                phone,
                role: role || 'STUDENT',
            },
        });

        const token = generateToken(user.id);
        setAuthCookie(res, token); // Set HTTP-Only cookie

        res.status(201).json({
            status: 'success',
            message: 'User registered successfully',
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
        setAuthCookie(res, token); // Set HTTP-Only cookie

        res.status(200).json({
            status: 'success',
            message: 'User logged in successfully',
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

// User logout (clears cookie)
export const logout = async (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    });
    res.status(200).json({
        status: 'success',
        message: 'Logged out successfully'
    });
};
