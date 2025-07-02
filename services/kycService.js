const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const { Onfido } = require('@onfido/api');
const User = require('../models/User');
const KYC = require('../models/KYC');

class KYCService {
    constructor() {
        this.onfido = new Onfido({
            apiToken: process.env.ONFIDO_API_TOKEN,
            region: 'EU'
        });
    }

    async initializeKYC(userId) {
        try {
            const user = await User.findById(userId);
            if (!user) throw new Error('User not found');

            let kyc = await KYC.findOne({ user: userId });
            if (!kyc) {
                kyc = new KYC({ user: userId });
                await kyc.save();
            }

            // Create Onfido applicant
            const applicant = await this.onfido.applicant.create({
                firstName: kyc.personalInfo?.firstName,
                lastName: kyc.personalInfo?.lastName,
                email: user.email,
                country: kyc.personalInfo?.residenceCountry
            });

            kyc.onfidoApplicantId = applicant.id;
            await kyc.save();

            // Create SDK token for the frontend
            const sdkToken = await this.onfido.sdkToken.generate({
                applicantId: applicant.id,
                referrer: process.env.FRONTEND_URL || '*'
            });

            return {
                status: kyc.status,
                sdkToken: sdkToken.token
            };
        } catch (error) {
            console.error('KYC initialization error:', error);
            throw new Error('Failed to initialize KYC process');
        }
    }

    async uploadDocument(userId, documentType, file) {
        try {
            const kyc = await KYC.findOne({ user: userId });
            if (!kyc) throw new Error('KYC process not initialized');

            // Save file temporarily
            const fileName = `${userId}-${documentType}-${Date.now()}${path.extname(file.originalname)}`;
            const filePath = path.join(__dirname, '../uploads/kyc', fileName);
            await fs.writeFile(filePath, file.buffer);

            // Upload to Onfido
            const document = await this.onfido.document.upload({
                applicantId: kyc.onfidoApplicantId,
                file: fs.createReadStream(filePath),
                type: this._mapDocumentType(documentType)
            });

            // Delete temporary file
            await fs.unlink(filePath);

            // Update KYC record
            kyc.documents.push({
                type: documentType,
                onfidoId: document.id,
                verificationStatus: 'pending',
                uploadedAt: new Date()
            });

            kyc.status = 'submitted';
            await kyc.save();

            return {
                status: kyc.status,
                documentId: document.id
            };
        } catch (error) {
            console.error('Document upload error:', error);
            throw new Error('Failed to upload document');
        }
    }

    async verifyDocuments(userId) {
        try {
            const kyc = await KYC.findOne({ user: userId });
            if (!kyc) throw new Error('KYC process not initialized');

            // Create Onfido check
            const check = await this.onfido.check.create({
                applicantId: kyc.onfidoApplicantId,
                reportNames: ['document', 'facial_similarity_photo']
            });

            kyc.onfidoCheckId = check.id;
            await kyc.save();

            return {
                status: 'pending',
                checkId: check.id
            };
        } catch (error) {
            console.error('KYC verification error:', error);
            throw new Error('KYC verification failed');
        }
    }

    async handleWebhook(payload) {
        try {
            const { resource_type, action, object } = payload;

            if (resource_type === 'check' && action === 'check.completed') {
                const kyc = await KYC.findOne({ onfidoCheckId: object.id });
                if (!kyc) throw new Error('KYC record not found');

                // Update KYC status based on check result
                kyc.status = object.status === 'complete' && object.result === 'clear' ? 'verified' : 'rejected';
                kyc.verificationLevel = kyc.status === 'verified' ? 'basic' : 'none';
                kyc.verifiedAt = kyc.status === 'verified' ? new Date() : undefined;
                kyc.rejectionReason = kyc.status === 'rejected' ? object.result_reason : undefined;

                await kyc.save();

                // Update user's verification level
                await User.findByIdAndUpdate(kyc.user, {
                    kycStatus: kyc.status,
                    verificationLevel: kyc.verificationLevel
                });

                return true;
            }

            return false;
        } catch (error) {
            console.error('Webhook handling error:', error);
            throw error;
        }
    }

    _mapDocumentType(type) {
        const typeMap = {
            passport: 'passport',
            nationalId: 'national_identity_card',
            utilityBill: 'utility_bill'
        };
        return typeMap[type] || type;
    }
}

module.exports = new KYCService();
