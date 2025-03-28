const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const speakeasy = require('speakeasy');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    twoFactor: {
        secret: String,
        enabled: {
            type: Boolean,
            default: false
        },
        verified: {
            type: Boolean,
            default: false
        },
        backupCodes: [{
            code: String,
            used: {
                type: Boolean,
                default: false
            }
        }],
        method: {
            type: String,
            enum: ['app', 'sms', 'email'],
            default: 'app'
        }
    },
    phoneNumber: {
        number: String,
        verified: {
            type: Boolean,
            default: false
        }
    },
    kycStatus: {
        type: String,
        enum: ['none', 'pending', 'submitted', 'verified', 'rejected'],
        default: 'none'
    },
    verificationLevel: {
        type: String,
        enum: ['none', 'basic', 'advanced'],
        default: 'none'
    },
    biometricCredentials: [{
        credentialId: String,
        publicKey: String,
        lastUsed: Date
    }],
    xrpWallet: {
        address: String,
        seed: {
            type: String,
            select: false // Only include when explicitly requested
        },
        balance: {
            type: Number,
            default: 0
        }
    },
    status: {
        type: String,
        enum: ['active', 'suspended', 'blocked'],
        default: 'active'
    },
    lastLogin: {
        timestamp: Date,
        ip: String,
        userAgent: String
    },
    failedLoginAttempts: {
        count: {
            type: Number,
            default: 0
        },
        lastAttempt: Date,
        lockUntil: Date
    }
}, {
    timestamps: true
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ 'phoneNumber.number': 1 });
userSchema.index({ kycStatus: 1 });
userSchema.index({ verificationLevel: 1 });
userSchema.index({ status: 1 });

// Password hashing middleware
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    try {
        this.password = await bcrypt.hash(this.password, 12);
        next();
    } catch (error) {
        next(error);
    }
});

// Methods
userSchema.methods.verifyPassword = async function(password) {
    return bcrypt.compare(password, this.password);
};

userSchema.methods.verify2FA = function(token) {
    if (!this.twoFactor.secret) return false;
    return speakeasy.totp.verify({
        secret: this.twoFactor.secret,
        encoding: 'base32',
        token: token
    });
};

userSchema.methods.generateBackupCodes = function() {
    const codes = Array.from({ length: 10 }, () => 
        Math.random().toString(36).substring(2, 8).toUpperCase()
    );
    
    this.twoFactor.backupCodes = codes.map(code => ({
        code: bcrypt.hashSync(code, 8),
        used: false
    }));
    
    return codes; // Return plain codes to show to user
};

userSchema.methods.verifyBackupCode = async function(code) {
    const backupCode = this.twoFactor.backupCodes.find(bc => !bc.used);
    if (!backupCode) return false;
    
    const isValid = await bcrypt.compare(code, backupCode.code);
    if (isValid) {
        backupCode.used = true;
        await this.save();
    }
    return isValid;
};

userSchema.methods.incrementFailedLogins = async function() {
    this.failedLoginAttempts.count += 1;
    this.failedLoginAttempts.lastAttempt = new Date();
    
    if (this.failedLoginAttempts.count >= 5) {
        const lockTime = new Date();
        lockTime.setMinutes(lockTime.getMinutes() + 30);
        this.failedLoginAttempts.lockUntil = lockTime;
    }
    
    await this.save();
};

userSchema.methods.resetFailedLogins = async function() {
    this.failedLoginAttempts.count = 0;
    this.failedLoginAttempts.lastAttempt = null;
    this.failedLoginAttempts.lockUntil = null;
    await this.save();
};

module.exports = mongoose.model('User', userSchema);
