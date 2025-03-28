const mongoose = require('mongoose');

const KYCSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['pending', 'submitted', 'verified', 'rejected'],
        default: 'pending'
    },
    onfidoApplicantId: {
        type: String,
        unique: true,
        sparse: true
    },
    onfidoCheckId: {
        type: String,
        sparse: true
    },
    documents: [{
        type: {
            type: String,
            enum: ['passport', 'nationalId', 'utilityBill'],
            required: true
        },
        onfidoId: {
            type: String,
            required: true
        },
        verificationStatus: {
            type: String,
            enum: ['pending', 'verified', 'rejected'],
            default: 'pending'
        },
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    verificationLevel: {
        type: String,
        enum: ['none', 'basic', 'advanced'],
        default: 'none'
    },
    personalInfo: {
        firstName: String,
        lastName: String,
        dateOfBirth: Date,
        nationality: String,
        residenceCountry: String,
        address: {
            street: String,
            city: String,
            state: String,
            postalCode: String,
            country: String
        },
        updatedAt: Date
    },
    verifiedAt: Date,
    rejectionReason: String
}, {
    timestamps: true
});

// Indexes
KYCSchema.index({ user: 1 });
KYCSchema.index({ status: 1 });
KYCSchema.index({ onfidoApplicantId: 1 });
KYCSchema.index({ onfidoCheckId: 1 });
KYCSchema.index({ verificationLevel: 1 });

module.exports = mongoose.model('KYC', KYCSchema);
