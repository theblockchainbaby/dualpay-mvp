const mongoose = require('mongoose');
const Currency = require('currency.js');

const FiatWalletSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    currency: {
        type: String,
        enum: ['USD', 'EUR', 'JPY', 'AED', 'SGD', 'CHF'],
        required: true
    },
    balance: {
        type: Number,
        default: 0,
        get: (v) => Currency(v, { precision: 2 }).value,
        set: (v) => Currency(v, { precision: 2 }).value
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastTransaction: {
        type: Date,
        default: null
    },
    limits: {
        daily: {
            type: Number,
            default: 10000 // Default daily limit
        },
        monthly: {
            type: Number,
            default: 50000 // Default monthly limit
        }
    },
    kycVerified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    toJSON: { getters: true }
});

// Compound index for user and currency
FiatWalletSchema.index({ user: 1, currency: 1 }, { unique: true });

// Index for queries by currency
FiatWalletSchema.index({ currency: 1 });

// Methods
FiatWalletSchema.methods.credit = async function(amount) {
    if (amount <= 0) throw new Error('Amount must be positive');
    this.balance = Currency(this.balance).add(amount).value;
    this.lastTransaction = new Date();
    return this.save();
};

FiatWalletSchema.methods.debit = async function(amount) {
    if (amount <= 0) throw new Error('Amount must be positive');
    if (Currency(this.balance).subtract(amount).value < 0) {
        throw new Error('Insufficient funds');
    }
    this.balance = Currency(this.balance).subtract(amount).value;
    this.lastTransaction = new Date();
    return this.save();
};

FiatWalletSchema.methods.checkLimit = async function(amount, type = 'daily') {
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const startOfMonth = new Date(now.setDate(1));
    
    const transactions = await mongoose.model('Transaction').find({
        wallet: this._id,
        createdAt: {
            $gte: type === 'daily' ? startOfDay : startOfMonth
        }
    });

    const total = transactions.reduce((sum, tx) => Currency(sum).add(tx.amount).value, 0);
    const limit = this.limits[type];

    return Currency(total).add(amount).value <= limit;
};

module.exports = mongoose.model('FiatWallet', FiatWalletSchema);
