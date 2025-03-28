const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateToken = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'Access denied. No token provided.' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Get user
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ error: 'Invalid token - user not found.' });
        }

        // Check if user is blocked or suspended
        if (user.status !== 'active') {
            return res.status(403).json({ 
                error: `Account is ${user.status}. Please contact support.` 
            });
        }

        // Check for account lockout
        if (user.failedLoginAttempts?.lockUntil && 
            user.failedLoginAttempts.lockUntil > new Date()) {
            return res.status(403).json({ 
                error: 'Account is temporarily locked. Please try again later.' 
            });
        }

        // Attach user to request
        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token.' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired.' });
        }
        console.error('Authentication error:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

const requireKYC = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required.' });
        }

        if (req.user.kycStatus !== 'verified') {
            return res.status(403).json({ 
                error: 'KYC verification required.',
                currentStatus: req.user.kycStatus 
            });
        }

        next();
    } catch (error) {
        console.error('KYC check error:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

module.exports = {
    authenticateToken,
    requireKYC
};
