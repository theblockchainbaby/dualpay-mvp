const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const cors = require('cors');
const xrpl = require('xrpl');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const multer = require('multer');
const mongoose = require('mongoose');
require('dotenv').config();
const session = require('express-session');
const helmet = require('helmet');
const morgan = require('morgan');

// Import models
const User = require('./models/User');
const Transaction = require('./models/Transaction');
const KYC = require('./models/KYC');
const FiatWallet = require('./models/FiatWallet');

// Import services
const biometricService = require('./services/biometricService');
const kycService = require('./services/kycService');
const twoFactorService = require('./services/twoFactorService');
const fiatWalletService = require('./services/fiatWalletService');

// Import routes
const kycRoutes = require('./routes/kyc');
const twoFactorRoutes = require('./routes/2fa');
const fiatWalletRoutes = require('./routes/fiat-wallet');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "blob:"],
            connectSrc: ["'self'", "wss:", "https:"],
            frameSrc: ["'self'"],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: []
        }
    },
    crossOriginEmbedderPolicy: false
}));

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: './uploads/kyc',
    filename: (req, file, cb) => {
        cb(null, `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage });

// API Routes
app.use('/api/kyc', kycRoutes);
app.use('/api/2fa', twoFactorRoutes);
app.use('/api/fiat-wallet', fiatWalletRoutes);

// Serve HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.get('/send', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'send.html'));
});

app.get('/receive', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'receive.html'));
});

app.get('/scan', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'scan.html'));
});

app.get('/pos', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pos.html'));
});

// Basic API endpoints
app.post('/api/login', (req, res) => {
    // Simplified login for testing
    res.json({ token: 'test-token' });
});

app.post('/api/register', (req, res) => {
    // Simplified registration for testing
    res.json({ token: 'test-token' });
});

// Authentication Middleware
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) return res.sendStatus(401);

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        
        if (!user) return res.sendStatus(403);
        
        req.user = user;
        next();
    } catch (error) {
        res.sendStatus(403);
    }
};

// KYC Middleware
const requireKYC = async (req, res, next) => {
    if (req.user.kycStatus !== 'approved') {
        return res.status(403).json({ error: 'KYC verification required' });
    }
    next();
};

// Send notification
const sendNotification = async (userId, notification) => {
    try {
        const user = await User.findById(userId);
        user.notifications.push(notification);
        await user.save();

        const ws = wss.clients.get(userId.toString());
        if (ws) {
            ws.send(JSON.stringify(notification));
        }
    } catch (error) {
        console.error('Notification error:', error);
    }
};

// API Routes
app.post('/api/login', async (req, res) => {
    try {
        const { username, password, twoFactorCode } = req.body;
        
        const user = await User.findOne({ username });
        if (!user || !(await user.verifyPassword(password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const verified = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token: twoFactorCode
        });

        if (!verified) {
            return res.status(401).json({ error: 'Invalid 2FA code' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        const secret = speakeasy.generateSecret({
            name: `DualPay:${username}`
        });

        const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);
        
        // Generate XRP wallet
        const wallet = xrpl.Wallet.generate();

        const user = new User({
            username,
            password,
            twoFactorSecret: secret.base32,
            xrpWallet: {
                address: wallet.address,
                seed: wallet.seed
            }
        });

        await user.save();

        res.json({
            message: 'Registration successful',
            qrCodeUrl,
            xrpAddress: wallet.address
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user profile
app.get('/api/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password -twoFactorSecret');
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Upload KYC documents
app.post('/api/kyc/upload', authenticateToken, upload.array('documents', 3), async (req, res) => {
    try {
        const user = req.user;
        const documentPaths = req.files.map(file => file.path);
        
        user.kycDocuments = documentPaths;
        user.kycStatus = 'pending';
        await user.save();

        // Trigger KYC verification process
        verifyKYC(user._id, documentPaths);

        res.json({ message: 'Documents uploaded successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Biometric Registration
app.post('/api/biometric/register', authenticateToken, async (req, res) => {
    try {
        const options = await biometricService.generateRegistrationOptions(
            req.user.username,
            req.user._id.toString()
        );
        
        // Store challenge in session for verification
        req.session.challenge = options.challenge;
        
        res.json(options);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/biometric/register/verify', authenticateToken, async (req, res) => {
    try {
        const credential = req.body;
        const result = await biometricService.verifyRegistration(credential);
        
        // Store credential in user's document
        req.user.biometricCredentials.push(result);
        await req.user.save();
        
        res.json({ message: 'Biometric registration successful' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Biometric Authentication
app.post('/api/biometric/authenticate', async (req, res) => {
    try {
        const { username } = req.body;
        const user = await User.findOne({ username });
        
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }
        
        const options = await biometricService.generateAuthenticationOptions(username);
        
        // Store challenge in session
        req.session.challenge = options.challenge;
        req.session.username = username;
        
        res.json(options);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/biometric/authenticate/verify', async (req, res) => {
    try {
        const { credential } = req.body;
        const username = req.session.username;
        const expectedChallenge = req.session.challenge;
        
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }
        
        // Find matching credential
        const storedCredential = user.biometricCredentials.find(
            c => c.credentialId === credential.id
        );
        
        if (!storedCredential) {
            return res.status(400).json({ error: 'Credential not found' });
        }
        
        const verified = await biometricService.verifyAuthentication(
            credential,
            expectedChallenge,
            storedCredential.publicKey
        );
        
        if (verified) {
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
            res.json({ token });
        } else {
            res.status(401).json({ error: 'Authentication failed' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Enhanced KYC verification endpoint
app.post('/api/kyc/verify', authenticateToken, async (req, res) => {
    try {
        const { identityData, addressData } = req.body;
        
        // Verify identity and address
        const [identityResult, addressResult] = await Promise.all([
            kycService.verifyIdentity(identityData),
            kycService.verifyAddress(addressData)
        ]);
        
        if (identityResult.verified && addressResult.verified) {
            req.user.kycStatus = 'approved';
            await req.user.save();
            
            // Send notification
            await sendNotification(req.user._id, {
                type: 'kyc',
                message: 'Your KYC verification has been approved',
                timestamp: new Date()
            });
            
            res.json({
                message: 'KYC verification successful',
                identityReference: identityResult.reference,
                addressReference: addressResult.reference
            });
        } else {
            res.status(400).json({ error: 'KYC verification failed' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// WebSocket connection handling
wss.on('connection', (ws) => {
    console.log('New WebSocket connection');

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            handleWebSocketMessage(ws, data);
        } catch (error) {
            console.error('WebSocket message error:', error);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// WebSocket message handler
async function handleWebSocketMessage(ws, data) {
    try {
        switch (data.type) {
            case 'TRANSACTION_UPDATE':
                // Handle transaction updates
                break;
            case 'KYC_UPDATE':
                // Handle KYC status updates
                break;
            default:
                console.warn('Unknown WebSocket message type:', data.type);
        }
    } catch (error) {
        console.error('WebSocket message handling error:', error);
        ws.send(JSON.stringify({ 
            type: 'ERROR', 
            error: 'Failed to process message' 
        }));
    }
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
