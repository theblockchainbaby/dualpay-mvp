const express = require('express');
const router = express.Router();
const twoFactorService = require('../services/twoFactorService');
const { authenticateToken } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// Setup 2FA
router.post('/setup',
    authenticateToken,
    body('method').isIn(['app', 'email', 'sms']),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const result = await twoFactorService.setupTwoFactor(
                req.user._id,
                req.body.method
            );
            res.json(result);
        } catch (error) {
            console.error('2FA setup error:', error);
            res.status(500).json({ error: error.message });
        }
    }
);

// Verify and enable 2FA
router.post('/verify',
    authenticateToken,
    body('token').isString().isLength({ min: 6, max: 6 }),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const result = await twoFactorService.verifyAndEnableTwoFactor(
                req.user._id,
                req.body.token
            );
            res.json(result);
        } catch (error) {
            console.error('2FA verification error:', error);
            res.status(500).json({ error: error.message });
        }
    }
);

// Verify 2FA token
router.post('/verify-token',
    body('token').isString().isLength({ min: 6, max: 8 }),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { userId } = req.body;
            const result = await twoFactorService.verifyToken(userId, req.body.token);
            res.json({ valid: result });
        } catch (error) {
            console.error('Token verification error:', error);
            res.status(500).json({ error: error.message });
        }
    }
);

// Disable 2FA
router.post('/disable',
    authenticateToken,
    body('token').isString().isLength({ min: 6, max: 8 }),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const result = await twoFactorService.disableTwoFactor(
                req.user._id,
                req.body.token
            );
            res.json(result);
        } catch (error) {
            console.error('2FA disable error:', error);
            res.status(500).json({ error: error.message });
        }
    }
);

// Generate new backup codes
router.post('/backup-codes',
    authenticateToken,
    body('token').isString().isLength({ min: 6, max: 8 }),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            // Verify current 2FA token before generating new backup codes
            const isValid = await twoFactorService.verifyToken(
                req.user._id,
                req.body.token
            );
            if (!isValid) {
                return res.status(401).json({ error: 'Invalid verification code' });
            }

            const user = await User.findById(req.user._id);
            const backupCodes = await user.generateBackupCodes();
            res.json({ backupCodes });
        } catch (error) {
            console.error('Backup codes generation error:', error);
            res.status(500).json({ error: error.message });
        }
    }
);

module.exports = router;
