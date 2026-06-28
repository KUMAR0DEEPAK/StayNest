import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';

// 1. Middleware to protect routes (checks if user is logged in)
export const protect = async (req, res, next) => {
  try {
    let token;

    // Check if JWT token is in the Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ error: 'You are not logged in. Please log in to get access.' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the user from database (excluding the password)
    const currentUser = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        full_name: true,
        email: true,
        role: true,
        phone: true,
        profile_image: true,
      }
    });

    if (!currentUser) {
      return res.status(401).json({ error: 'The user belonging to this token no longer exists.' });
    }

    // Attach user to the request object
    req.user = currentUser;
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token. Please log in again.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired. Please log in again.' });
    }
    res.status(500).json({ error: 'Internal server error during authentication' });
  }
};

// 2. Middleware to restrict access based on role(s)
export const authorize = (...roles) => {
  return (req, res, next) => {
    // roles example: ['STUDENT', 'ADMIN']
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: `You do not have permission to perform this action. Allowed roles: ${roles.join(', ')}`,
      });
    }
    next();
  };
};
