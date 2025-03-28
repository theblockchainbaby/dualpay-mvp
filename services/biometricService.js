const base64url = require('base64url');
const crypto = require('crypto');

class BiometricService {
    constructor() {
        this.rpName = 'DualPay';
        this.rpID = 'localhost'; // Change this to your domain in production
        this.origin = `http://${this.rpID}:3000`;
    }

    async generateRegistrationOptions(username, userId) {
        // Generate a challenge
        const challenge = crypto.randomBytes(32);

        const registrationOptions = {
            challenge: base64url.encode(challenge),
            rp: {
                name: this.rpName,
                id: this.rpID
            },
            user: {
                id: base64url.encode(Buffer.from(userId)),
                name: username,
                displayName: username
            },
            pubKeyCredParams: [
                { type: 'public-key', alg: -7 }, // ES256
                { type: 'public-key', alg: -257 } // RS256
            ],
            timeout: 60000,
            attestation: 'direct',
            authenticatorSelection: {
                authenticatorAttachment: 'platform',
                userVerification: 'required',
                requireResidentKey: false
            }
        };

        return registrationOptions;
    }

    async verifyRegistration(credential) {
        try {
            const { id, rawId, response, type } = credential;

            if (type !== 'public-key') {
                throw new Error('Invalid credential type');
            }

            // Verify attestation
            const attestationBuffer = base64url.toBuffer(response.attestationObject);
            const clientDataBuffer = base64url.toBuffer(response.clientDataJSON);
            
            // In production, perform proper attestation verification here
            // For now, we'll just extract the public key
            
            return {
                credentialId: id,
                publicKey: response.publicKey,
                counter: 0
            };
        } catch (error) {
            console.error('Credential verification failed:', error);
            throw new Error('Failed to verify credential');
        }
    }

    async generateAuthenticationOptions(username) {
        const challenge = crypto.randomBytes(32);

        return {
            challenge: base64url.encode(challenge),
            timeout: 60000,
            rpId: this.rpID,
            allowCredentials: [], // In production, fetch user's credentials from database
            userVerification: 'required'
        };
    }

    async verifyAuthentication(credential, expectedChallenge, publicKey) {
        try {
            const { id, rawId, response, type } = credential;

            if (type !== 'public-key') {
                throw new Error('Invalid credential type');
            }

            // Verify the challenge
            const clientDataJSON = JSON.parse(
                base64url.decode(response.clientDataJSON)
            );

            if (clientDataJSON.challenge !== expectedChallenge) {
                throw new Error('Challenge verification failed');
            }

            // In production, verify the signature using the stored public key
            
            return true;
        } catch (error) {
            console.error('Authentication verification failed:', error);
            throw new Error('Failed to verify authentication');
        }
    }
}

module.exports = new BiometricService();
