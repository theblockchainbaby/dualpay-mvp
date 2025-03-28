const { authenticator } = require('otplib');
const nodemailer = require('nodemailer');
const User = require('../models/User');

class TwoFactorService {
    constructor() {
        this.emailTransporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
    }

    async setupTwoFactor(userId, method = 'app') {
        try {
            const user = await User.findById(userId);
            if (!user) throw new Error('User not found');

            // Generate new secret
            const secret = authenticator.generateSecret();
            
            // Update user's 2FA settings
            user.twoFactor = {
                secret,
                enabled: false,
                verified: false,
                method,
                backupCodes: []
            };
            
            await user.save();

            // Generate QR code or send verification code based on method
            if (method === 'app') {
                const otpauth = authenticator.keyuri(
                    user.email,
                    'DualPay',
                    secret
                );
                return { secret, otpauth };
            } else if (method === 'email') {
                const token = this._generateToken();
                await this._sendEmailToken(user.email, token);
                return { message: 'Verification code sent to email' };
            } else if (method === 'sms') {
                if (!user.phoneNumber?.verified) {
                    throw new Error('Phone number not verified');
                }
                const token = this._generateToken();
                await this._sendSMSToken(user.phoneNumber.number, token);
                return { message: 'Verification code sent to phone' };
            }
        } catch (error) {
            console.error('2FA setup error:', error);
            throw new Error('Failed to setup 2FA');
        }
    }

    async verifyAndEnableTwoFactor(userId, token) {
        try {
            const user = await User.findById(userId);
            if (!user) throw new Error('User not found');
            if (!user.twoFactor?.secret) throw new Error('2FA not set up');

            let isValid = false;
            if (user.twoFactor.method === 'app') {
                isValid = authenticator.verify({
                    token,
                    secret: user.twoFactor.secret
                });
            } else {
                isValid = await this._verifyToken(token);
            }

            if (!isValid) throw new Error('Invalid verification code');

            // Generate backup codes
            const backupCodes = await user.generateBackupCodes();
            
            // Enable 2FA
            user.twoFactor.enabled = true;
            user.twoFactor.verified = true;
            await user.save();

            return { 
                enabled: true,
                backupCodes 
            };
        } catch (error) {
            console.error('2FA verification error:', error);
            throw new Error('Failed to verify 2FA');
        }
    }

    async verifyToken(userId, token) {
        try {
            const user = await User.findById(userId);
            if (!user) throw new Error('User not found');
            if (!user.twoFactor?.enabled) throw new Error('2FA not enabled');

            // Try regular 2FA token
            if (user.twoFactor.method === 'app') {
                const isValid = authenticator.verify({
                    token,
                    secret: user.twoFactor.secret
                });
                if (isValid) return true;
            } else {
                const isValid = await this._verifyToken(token);
                if (isValid) return true;
            }

            // Try backup code if regular token fails
            return user.verifyBackupCode(token);
        } catch (error) {
            console.error('Token verification error:', error);
            throw new Error('Failed to verify token');
        }
    }

    async disableTwoFactor(userId, token) {
        try {
            const user = await User.findById(userId);
            if (!user) throw new Error('User not found');
            if (!user.twoFactor?.enabled) throw new Error('2FA not enabled');

            // Verify token before disabling
            const isValid = await this.verifyToken(userId, token);
            if (!isValid) throw new Error('Invalid verification code');

            user.twoFactor = {
                secret: null,
                enabled: false,
                verified: false,
                method: 'app',
                backupCodes: []
            };
            await user.save();

            return { disabled: true };
        } catch (error) {
            console.error('2FA disable error:', error);
            throw new Error('Failed to disable 2FA');
        }
    }

    _generateToken() {
        return Math.random().toString().substr(2, 6);
    }

    async _sendEmailToken(email, token) {
        try {
            await this.emailTransporter.sendMail({
                from: process.env.SMTP_FROM,
                to: email,
                subject: 'DualPay - Two-Factor Authentication Code',
                text: `Your verification code is: ${token}`,
                html: `
                    <h2>DualPay Two-Factor Authentication</h2>
                    <p>Your verification code is: <strong>${token}</strong></p>
                    <p>This code will expire in 10 minutes.</p>
                `
            });
        } catch (error) {
            console.error('Email sending error:', error);
            throw new Error('Failed to send email verification code');
        }
    }

    async _sendSMSToken(phoneNumber, token) {
        try {
            // Implement SMS sending logic here
            // You can use services like Twilio, MessageBird, etc.
            console.log(`SMS token ${token} would be sent to ${phoneNumber}`);
        } catch (error) {
            console.error('SMS sending error:', error);
            throw new Error('Failed to send SMS verification code');
        }
    }

    async _verifyToken(token) {
        // Implement token verification logic for email/SMS methods
        // This should check against a stored token in a temporary storage
        return true; // Placeholder
    }
}

module.exports = new TwoFactorService();
