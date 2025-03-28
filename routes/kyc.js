const express = require('express');
const router = express.Router();
const multer = require('multer');
const kycService = require('../services/kycService');
const { authenticateToken } = require('../middleware/auth');
const KYC = require('../models/KYC');

// Configure multer for file uploads
const storage = multer.memoryStorage(); 
const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
        files: 1 
    },
    fileFilter: (req, file, cb) => {
        // Accept images and PDFs
        if (!file.mimetype.match(/^(image\/|application\/pdf)/)) {
            return cb(new Error('Only images and PDF files are allowed'));
        }
        cb(null, true);
    }
});

// Initialize KYC process
router.post('/initialize', authenticateToken, async (req, res) => {
    try {
        const result = await kycService.initializeKYC(req.user._id);
        res.json(result);
    } catch (error) {
        console.error('KYC initialization error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Upload KYC document
router.post('/upload/:type', 
    authenticateToken,
    upload.single('document'),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }

            const documentType = req.params.type;
            const allowedTypes = ['passport', 'nationalId', 'utilityBill'];
            
            if (!allowedTypes.includes(documentType)) {
                return res.status(400).json({ error: 'Invalid document type' });
            }

            const result = await kycService.uploadDocument(
                req.user._id,
                documentType,
                req.file
            );

            res.json(result);
        } catch (error) {
            console.error('Document upload error:', error);
            res.status(500).json({ error: error.message });
        }
    }
);

// Get KYC status
router.get('/status', authenticateToken, async (req, res) => {
    try {
        const kyc = await KYC.findOne({ user: req.user._id });
        if (!kyc) {
            return res.status(404).json({ error: 'KYC record not found' });
        }

        res.json({
            status: kyc.status,
            level: kyc.verificationLevel,
            documents: kyc.documents.map(doc => ({
                type: doc.type,
                status: doc.verificationStatus,
                uploadedAt: doc.uploadedAt
            }))
        });
    } catch (error) {
        console.error('KYC status error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Update personal information
router.put('/personal-info', 
    authenticateToken,
    express.json(),
    async (req, res) => {
        try {
            const kyc = await KYC.findOne({ user: req.user._id });
            if (!kyc) {
                return res.status(404).json({ error: 'KYC record not found' });
            }

            // Validate required fields
            const requiredFields = ['firstName', 'lastName', 'dateOfBirth', 'nationality'];
            const missingFields = requiredFields.filter(field => !req.body[field]);
            
            if (missingFields.length > 0) {
                return res.status(400).json({
                    error: `Missing required fields: ${missingFields.join(', ')}`
                });
            }

            // Update personal information
            kyc.personalInfo = {
                ...kyc.personalInfo,
                ...req.body,
                updatedAt: new Date()
            };

            await kyc.save();
            res.json({ message: 'Personal information updated', data: kyc.personalInfo });
        } catch (error) {
            console.error('Personal info update error:', error);
            res.status(500).json({ error: error.message });
        }
    }
);

// Verify documents and complete KYC
router.post('/verify', authenticateToken, async (req, res) => {
    try {
        const result = await kycService.verifyDocuments(req.user._id);
        res.json(result);
    } catch (error) {
        console.error('KYC verification error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Webhook endpoint for Onfido notifications
router.post('/webhook', express.json(), async (req, res) => {
    try {
        // Verify webhook signature
        const signature = req.headers['x-sha2-signature'];
        if (!signature) {
            return res.status(401).json({ error: 'Missing webhook signature' });
        }

        // TODO: Implement signature verification
        // const isValid = verifyWebhookSignature(req.body, signature);
        // if (!isValid) {
        //     return res.status(401).json({ error: 'Invalid webhook signature' });
        // }

        await kycService.handleWebhook(req.body);
        res.json({ message: 'Webhook processed successfully' });
    } catch (error) {
        console.error('Webhook processing error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
