const express = require('express');
const router = express.Router();
const fiatWalletService = require('../services/fiatWalletService');
const { authenticateToken, requireKYC } = require('../middleware/auth');
const { body, param, validationResult } = require('express-validator');

// Create new wallet
router.post('/',
    authenticateToken,
    requireKYC,
    body('currency').isIn(['USD', 'EUR', 'JPY', 'AED', 'SGD', 'CHF']),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const wallet = await fiatWalletService.createWallet(
                req.user._id,
                req.body.currency
            );
            res.json(wallet);
        } catch (error) {
            console.error('Wallet creation error:', error);
            res.status(500).json({ error: error.message });
        }
    }
);

// Get all wallets
router.get('/',
    authenticateToken,
    async (req, res) => {
        try {
            const wallets = await fiatWalletService.getAllWallets(req.user._id);
            res.json(wallets);
        } catch (error) {
            console.error('Get wallets error:', error);
            res.status(500).json({ error: error.message });
        }
    }
);

// Get specific wallet
router.get('/:currency',
    authenticateToken,
    param('currency').isIn(['USD', 'EUR', 'JPY', 'AED', 'SGD', 'CHF']),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const wallet = await fiatWalletService.getWallet(
                req.user._id,
                req.params.currency
            );
            res.json(wallet);
        } catch (error) {
            console.error('Get wallet error:', error);
            res.status(500).json({ error: error.message });
        }
    }
);

// Deposit funds
router.post('/deposit',
    authenticateToken,
    requireKYC,
    [
        body('currency').isIn(['USD', 'EUR', 'JPY', 'AED', 'SGD', 'CHF']),
        body('amount').isFloat({ min: 0.01 })
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const result = await fiatWalletService.deposit(
                req.user._id,
                req.body.currency,
                req.body.amount
            );
            res.json(result);
        } catch (error) {
            console.error('Deposit error:', error);
            res.status(500).json({ error: error.message });
        }
    }
);

// Withdraw funds
router.post('/withdraw',
    authenticateToken,
    requireKYC,
    [
        body('currency').isIn(['USD', 'EUR', 'JPY', 'AED', 'SGD', 'CHF']),
        body('amount').isFloat({ min: 0.01 }),
        body('destinationAccount').isString().notEmpty()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const result = await fiatWalletService.withdraw(
                req.user._id,
                req.body.currency,
                req.body.amount,
                req.body.destinationAccount
            );
            res.json(result);
        } catch (error) {
            console.error('Withdrawal error:', error);
            res.status(500).json({ error: error.message });
        }
    }
);

// Transfer funds
router.post('/transfer',
    authenticateToken,
    requireKYC,
    [
        body('currency').isIn(['USD', 'EUR', 'JPY', 'AED', 'SGD', 'CHF']),
        body('amount').isFloat({ min: 0.01 }),
        body('toUserId').isString().notEmpty()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const result = await fiatWalletService.transfer(
                req.user._id,
                req.body.toUserId,
                req.body.currency,
                req.body.amount
            );
            res.json(result);
        } catch (error) {
            console.error('Transfer error:', error);
            res.status(500).json({ error: error.message });
        }
    }
);

// Get exchange rates
router.get('/exchange-rates/:baseCurrency?',
    authenticateToken,
    param('baseCurrency').optional().isIn(['USD', 'EUR', 'JPY', 'AED', 'SGD', 'CHF']),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const rates = await fiatWalletService.getExchangeRates(
                req.params.baseCurrency
            );
            res.json(rates);
        } catch (error) {
            console.error('Exchange rates error:', error);
            res.status(500).json({ error: error.message });
        }
    }
);

// Convert currency
router.post('/convert',
    authenticateToken,
    [
        body('amount').isFloat({ min: 0.01 }),
        body('fromCurrency').isIn(['USD', 'EUR', 'JPY', 'AED', 'SGD', 'CHF']),
        body('toCurrency').isIn(['USD', 'EUR', 'JPY', 'AED', 'SGD', 'CHF'])
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const result = await fiatWalletService.convertCurrency(
                req.body.amount,
                req.body.fromCurrency,
                req.body.toCurrency
            );
            res.json({ convertedAmount: result });
        } catch (error) {
            console.error('Currency conversion error:', error);
            res.status(500).json({ error: error.message });
        }
    }
);

module.exports = router;
