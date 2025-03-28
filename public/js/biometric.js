class BiometricAuth {
    constructor() {
        this.isAvailable = typeof PublicKeyCredential !== 'undefined';
    }

    async checkBiometricAvailability() {
        if (!this.isAvailable) {
            throw new Error('WebAuthn is not supported in this browser');
        }

        return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    }

    async register() {
        try {
            // Get registration options from server
            const response = await fetch('/api/biometric/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to get registration options');
            }

            const options = await response.json();

            // Convert base64 challenge to ArrayBuffer
            options.challenge = this._base64ToArrayBuffer(options.challenge);
            options.user.id = this._base64ToArrayBuffer(options.user.id);

            // Create credentials
            const credential = await navigator.credentials.create({
                publicKey: options
            });

            // Convert credential for sending to server
            const credentialResponse = {
                id: credential.id,
                rawId: this._arrayBufferToBase64(credential.rawId),
                response: {
                    attestationObject: this._arrayBufferToBase64(credential.response.attestationObject),
                    clientDataJSON: this._arrayBufferToBase64(credential.response.clientDataJSON)
                },
                type: credential.type
            };

            // Send credential to server for verification
            const verifyResponse = await fetch('/api/biometric/register/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(credentialResponse)
            });

            if (!verifyResponse.ok) {
                throw new Error('Failed to verify registration');
            }

            return await verifyResponse.json();
        } catch (error) {
            console.error('Biometric registration error:', error);
            throw error;
        }
    }

    async authenticate(username) {
        try {
            // Get authentication options from server
            const response = await fetch('/api/biometric/authenticate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username })
            });

            if (!response.ok) {
                throw new Error('Failed to get authentication options');
            }

            const options = await response.json();

            // Convert base64 challenge to ArrayBuffer
            options.challenge = this._base64ToArrayBuffer(options.challenge);

            if (options.allowCredentials) {
                options.allowCredentials = options.allowCredentials.map(credential => ({
                    ...credential,
                    id: this._base64ToArrayBuffer(credential.id)
                }));
            }

            // Get credentials
            const credential = await navigator.credentials.get({
                publicKey: options
            });

            // Convert credential for sending to server
            const credentialResponse = {
                id: credential.id,
                rawId: this._arrayBufferToBase64(credential.rawId),
                response: {
                    authenticatorData: this._arrayBufferToBase64(credential.response.authenticatorData),
                    clientDataJSON: this._arrayBufferToBase64(credential.response.clientDataJSON),
                    signature: this._arrayBufferToBase64(credential.response.signature)
                },
                type: credential.type
            };

            // Verify with server
            const verifyResponse = await fetch('/api/biometric/authenticate/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ credential: credentialResponse })
            });

            if (!verifyResponse.ok) {
                throw new Error('Authentication failed');
            }

            const { token } = await verifyResponse.json();
            localStorage.setItem('token', token);
            return true;
        } catch (error) {
            console.error('Biometric authentication error:', error);
            throw error;
        }
    }

    _arrayBufferToBase64(buffer) {
        const bytes = new Uint8Array(buffer);
        let string = '';
        for (const byte of bytes) {
            string += String.fromCharCode(byte);
        }
        return btoa(string);
    }

    _base64ToArrayBuffer(base64) {
        const binaryString = atob(base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    }
}

// Export for use in other files
window.BiometricAuth = BiometricAuth;
