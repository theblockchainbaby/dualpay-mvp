const Currency = require('currency.js');
const User = require('../models/User');
const FiatWallet = require('../models/FiatWallet');
const Transaction = require('../models/Transaction');

class FiatWalletService {
    constructor() {
        this.supportedCurrencies = ['USD', 'EUR', 'JPY', 'AED', 'SGD', 'CHF'];
        this.exchangeRateProvider = process.env.EXCHANGE_RATE_PROVIDER || 'https://api.exchangerate-api.com/v4/latest/USD';
    }

    async createWallet(userId, currency) {
        try {
            if (!this.supportedCurrencies.includes(currency)) {
                throw new Error(`Unsupported currency: ${currency}`);
            }

            const user = await User.findById(userId);
            if (!user) throw new Error('User not found');

            // Check if wallet already exists
            const existingWallet = await FiatWallet.findOne({ user: userId, currency });
            if (existingWallet) {
                throw new Error(`Wallet for ${currency} already exists`);
            }

            // Create new wallet
            const wallet = new FiatWallet({
                user: userId,
                currency,
                balance: 0,
                isActive: true
            });

            await wallet.save();
            return wallet;
        } catch (error) {
            console.error('Wallet creation error:', error);
            throw error;
        }
    }

    async getWallet(userId, currency) {
        try {
            const wallet = await FiatWallet.findOne({ user: userId, currency });
            if (!wallet) throw new Error(`Wallet for ${currency} not found`);
            return wallet;
        } catch (error) {
            console.error('Get wallet error:', error);
            throw error;
        }
    }

    async getAllWallets(userId) {
        try {
            const wallets = await FiatWallet.find({ user: userId });
            return wallets;
        } catch (error) {
            console.error('Get all wallets error:', error);
            throw error;
        }
    }

    async deposit(userId, currency, amount) {
        try {
            const wallet = await this.getWallet(userId, currency);
            if (!wallet.isActive) throw new Error('Wallet is inactive');

            // Verify KYC status
            const user = await User.findById(userId);
            if (!user || user.kycStatus !== 'verified') {
                throw new Error('KYC verification required for deposits');
            }

            // Check deposit limits
            if (!(await wallet.checkLimit(amount))) {
                throw new Error('Deposit exceeds daily/monthly limit');
            }

            // Create transaction record
            const transaction = new Transaction({
                user: userId,
                wallet: wallet._id,
                type: 'deposit',
                amount: amount,
                currency: currency,
                status: 'pending'
            });

            // Process deposit (integrate with payment provider here)
            // ... payment processing logic ...

            // Update wallet balance
            await wallet.credit(amount);
            
            // Update transaction status
            transaction.status = 'completed';
            await transaction.save();

            return {
                transaction: transaction._id,
                newBalance: wallet.balance
            };
        } catch (error) {
            console.error('Deposit error:', error);
            throw error;
        }
    }

    async withdraw(userId, currency, amount, destinationAccount) {
        try {
            const wallet = await this.getWallet(userId, currency);
            if (!wallet.isActive) throw new Error('Wallet is inactive');

            // Verify KYC status
            const user = await User.findById(userId);
            if (!user || user.kycStatus !== 'verified') {
                throw new Error('KYC verification required for withdrawals');
            }

            // Check withdrawal limits
            if (!(await wallet.checkLimit(amount))) {
                throw new Error('Withdrawal exceeds daily/monthly limit');
            }

            // Create transaction record
            const transaction = new Transaction({
                user: userId,
                wallet: wallet._id,
                type: 'withdrawal',
                amount: amount,
                currency: currency,
                destination: destinationAccount,
                status: 'pending'
            });

            // Verify sufficient balance
            if (wallet.balance < amount) {
                throw new Error('Insufficient funds');
            }

            // Process withdrawal (integrate with payment provider here)
            // ... withdrawal processing logic ...

            // Update wallet balance
            await wallet.debit(amount);
            
            // Update transaction status
            transaction.status = 'completed';
            await transaction.save();

            return {
                transaction: transaction._id,
                newBalance: wallet.balance
            };
        } catch (error) {
            console.error('Withdrawal error:', error);
            throw error;
        }
    }

    async transfer(fromUserId, toUserId, currency, amount) {
        try {
            const sourceWallet = await this.getWallet(fromUserId, currency);
            const targetWallet = await this.getWallet(toUserId, currency);

            if (!sourceWallet.isActive || !targetWallet.isActive) {
                throw new Error('One or both wallets are inactive');
            }

            // Verify KYC status for both users
            const [fromUser, toUser] = await Promise.all([
                User.findById(fromUserId),
                User.findById(toUserId)
            ]);

            if (!fromUser || !toUser || 
                fromUser.kycStatus !== 'verified' || 
                toUser.kycStatus !== 'verified') {
                throw new Error('KYC verification required for transfers');
            }

            // Check transfer limits
            if (!(await sourceWallet.checkLimit(amount))) {
                throw new Error('Transfer exceeds daily/monthly limit');
            }

            // Create transaction records
            const [sendTransaction, receiveTransaction] = await Promise.all([
                new Transaction({
                    user: fromUserId,
                    wallet: sourceWallet._id,
                    type: 'transfer_out',
                    amount: amount,
                    currency: currency,
                    relatedUser: toUserId,
                    status: 'pending'
                }).save(),
                new Transaction({
                    user: toUserId,
                    wallet: targetWallet._id,
                    type: 'transfer_in',
                    amount: amount,
                    currency: currency,
                    relatedUser: fromUserId,
                    status: 'pending'
                }).save()
            ]);

            // Process transfer
            await Promise.all([
                sourceWallet.debit(amount),
                targetWallet.credit(amount)
            ]);

            // Update transaction statuses
            await Promise.all([
                Transaction.findByIdAndUpdate(sendTransaction._id, { status: 'completed' }),
                Transaction.findByIdAndUpdate(receiveTransaction._id, { status: 'completed' })
            ]);

            return {
                sourceTransaction: sendTransaction._id,
                targetTransaction: receiveTransaction._id,
                newSourceBalance: sourceWallet.balance,
                newTargetBalance: targetWallet.balance
            };
        } catch (error) {
            console.error('Transfer error:', error);
            throw error;
        }
    }

    async getExchangeRates(baseCurrency = 'USD') {
        try {
            const response = await fetch(`${this.exchangeRateProvider}/${baseCurrency}`);
            const data = await response.json();
            
            // Filter only supported currencies
            const rates = {};
            this.supportedCurrencies.forEach(currency => {
                if (data.rates[currency]) {
                    rates[currency] = data.rates[currency];
                }
            });

            return {
                base: baseCurrency,
                timestamp: data.time_last_updated,
                rates
            };
        } catch (error) {
            console.error('Exchange rates error:', error);
            throw new Error('Failed to fetch exchange rates');
        }
    }

    async convertCurrency(amount, fromCurrency, toCurrency) {
        try {
            const rates = await this.getExchangeRates(fromCurrency);
            if (!rates.rates[toCurrency]) {
                throw new Error(`Exchange rate not available for ${toCurrency}`);
            }

            const convertedAmount = Currency(amount).multiply(rates.rates[toCurrency]);
            return convertedAmount.value;
        } catch (error) {
            console.error('Currency conversion error:', error);
            throw error;
        }
    }
}

module.exports = new FiatWalletService();
