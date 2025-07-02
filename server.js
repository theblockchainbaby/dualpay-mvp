const express = require('express');
const http = require('http');
const https = require('https');
const fs = require('fs');
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

// SSL options
const sslOptions = {
    key: fs.readFileSync(path.join(__dirname, 'ssl', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'ssl', 'cert.pem'))
};

const server = http.createServer(app);
const httpsServer = https.createServer(sslOptions, app);
const wss = new WebSocket.Server({ server: httpsServer });
const port = process.env.PORT || 3000;
const httpsPort = process.env.HTTPS_PORT || 3443;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdn.tailwindcss.com", "https://cdn.jsdelivr.net"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdn.tailwindcss.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
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
        console.log('Login attempt:', { username, hasPassword: !!password, has2FA: !!twoFactorCode });
        
        // Find user by username or email
        const user = await User.findOne({ 
            $or: [{ username }, { email: username }] 
        });
        
        console.log('User found:', !!user);
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }
        
        const passwordValid = await user.verifyPassword(password);
        console.log('Password valid:', passwordValid);
        
        if (!passwordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        // Check if account is locked
        if (user.failedLoginAttempts.lockUntil && user.failedLoginAttempts.lockUntil > new Date()) {
            return res.status(423).json({ error: 'Account temporarily locked. Try again later.' });
        }

        // If the user has 2FA enabled, the code must be valid
        if (user.twoFactor.enabled && user.twoFactor.secret) {
            if (!twoFactorCode) {
                return res.status(401).json({ error: '2FA code required' });
            }
            
            const verified = user.verify2FA(twoFactorCode);
            if (!verified) {
                await user.incrementFailedLogins();
                return res.status(401).json({ error: 'Invalid 2FA code' });
            }
        }

        // Reset failed login attempts on successful login
        if (user.failedLoginAttempts.count > 0) {
            await user.resetFailedLogins();
        }

        // Update last login
        user.lastLogin = {
            timestamp: new Date(),
            ip: req.ip,
            userAgent: req.get('User-Agent')
        };
        await user.save();

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '24h' });
        console.log('Login successful for user:', username);
        res.json({ token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ 
            $or: [{ username }, { email }] 
        });
        if (existingUser) {
            return res.status(400).json({ error: 'Username or email already exists' });
        }

        // Generate 2FA secret
        const secret = speakeasy.generateSecret({
            name: `DualPay:${username}`,
            issuer: 'DualPay'
        });

        const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);
        
        // Generate XRP wallet
        const wallet = xrpl.Wallet.generate();

        const user = new User({
            username,
            email,
            password, // Will be hashed by the pre-save middleware
            twoFactor: {
                secret: secret.base32,
                enabled: false,
                verified: false
            },
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

app.get('/api/create-secure-user', async (req, res) => {
    try {
        // Create a user with a secure password that won't trigger browser warnings
        const secureUser = new User({
            username: 'demouser',
            email: 'demo@dualpay.com',
            password: 'DualPay2024!SecurePass', // Strong, unique password
            twoFactor: {
                secret: '',
                enabled: false,
                verified: false
            },
            xrpWallet: {
                address: 'rDemoAddress456',
                seed: 'demo-seed-456'
            }
        });
        
        await secureUser.save();
        res.json({ 
            message: 'Secure demo user created',
            username: 'demouser',
            password: 'DualPay2024!SecurePass',
            note: 'Use these credentials to login without browser warnings'
        });
    } catch (error) {
        if (error.code === 11000) {
            // User already exists, update password
            await User.findOneAndUpdate(
                { username: 'demouser' }, 
                { password: 'DualPay2024!SecurePass' }
            );
            res.json({ 
                message: 'Demo user password updated',
                username: 'demouser',
                password: 'DualPay2024!SecurePass',
                note: 'Use these credentials to login without browser warnings'
            });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

// Test user endpoint
app.get('/api/test-user', async (req, res) => {
    try {
        // Check if any users exist
        const userCount = await User.countDocuments();
        const users = await User.find({}).select('username email');
        
        // Always create a fresh test user for login testing
        const testUser = new User({
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123', // Will be hashed by pre-save middleware
            twoFactor: {
                secret: '',
                enabled: false,
                verified: false
            },
            xrpWallet: {
                address: 'rTestAddress123',
                seed: 'test-seed-123'
            }
        });
        
        await testUser.save();
        res.json({ 
            message: 'Fresh test user created',
            username: 'testuser',
            password: 'password123',
            userCount: userCount + 1,
            note: 'Use these credentials to login'
        });
    } catch (error) {
        if (error.code === 11000) {
            // User already exists, update password
            await User.findOneAndUpdate(
                { username: 'testuser' }, 
                { password: 'password123' }
            );
            res.json({ 
                message: 'Test user password updated',
                username: 'testuser',
                password: 'password123',
                note: 'Use these credentials to login'
            });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

// Get user profile
app.get('/api/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password -twoFactorSecret');
        // Combine with fiat wallet info for a complete profile
        const fiatWallet = await FiatWallet.findOne({ userId: req.user._id });

        res.json({
            ...user.toObject(),
            fiatBalance: fiatWallet ? fiatWallet.balance : 0,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/balance/xrp', authenticateToken, async (req, res) => {
    try {
        const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233');
        await client.connect();
        const response = await client.request({
            command: 'account_info',
            account: req.user.xrpWallet.address,
            ledger_index: 'validated'
        });
        await client.disconnect();
        const balance = response.result.account_data.Balance;
        res.json({ balance: xrpl.dropsToXrp(balance) });
    } catch (error) {
        console.error('Error fetching XRP balance:', error);
        res.status(500).json({ error: 'Failed to fetch XRP balance' });
    }
});

app.get('/api/price/xrp-usd', async (req, res) => {
    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ripple&vscurrencies=usd');
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching XRP price:', error);
        res.status(500).json({ error: 'Failed to fetch XRP price' });
    }
});

app.get('/api/transactions', authenticateToken, async (req, res) => {
    try {
        const transactions = await Transaction.find({ $or: [{ from: req.user.xrpWallet.address }, { to: req.user.xrpWallet.address }] })
            .sort({ date: -1 })
            .limit(10);
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch transactions' });
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

// Create test users for development
async function createTestUsers() {
    try {
        const testUsers = [
            {
                username: 'demo',
                email: 'demo@dualpay.com',
                password: 'demopass'
            },
            {
                username: 'test',
                email: 'test@dualpay.com',
                password: 'password123'
            },
            {
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123'
            }
        ];

        for (const userData of testUsers) {
            try {
                // Check if user exists
                const existingUser = await User.findOne({
                    $or: [{ username: userData.username }, { email: userData.email }]
                });

                if (!existingUser) {
                    const user = new User({
                        username: userData.username,
                        email: userData.email,
                        password: userData.password, // Will be hashed by pre-save middleware
                        twoFactor: {
                            secret: '',
                            enabled: false,
                            verified: false
                        },
                        xrpWallet: {
                            address: `r${userData.username}Address123`,
                            seed: `${userData.username}-seed-123`
                        }
                    });
                    
                    await user.save();
                    console.log(`✅ Created test user: ${userData.username} (${userData.email})`);
                } else {
                    // Update password to ensure it's correct
                    existingUser.password = userData.password;
                    await existingUser.save();
                    console.log(`🔄 Updated test user: ${userData.username} (${userData.email})`);
                }
            } catch (error) {
                console.log(`⚠️ Error with user ${userData.username}:`, error.message);
            }
        }
        
        console.log('🎯 Test users ready for login!');
        console.log('📋 Available credentials:');
        console.log('   • demo@dualpay.com / demopass');
        console.log('   • test@dualpay.com / password123');
        console.log('   • testuser / password123');
    } catch (error) {
        console.error('Error creating test users:', error);
    }
}

// Start servers
server.listen(port, '0.0.0.0', () => {
    console.log(`HTTP Server is running on port ${port}`);
    console.log(`Local HTTP access: http://localhost:${port}`);
    console.log(`Network HTTP access: http://0.0.0.0:${port}`);
});

httpsServer.listen(httpsPort, '0.0.0.0', async () => {
    console.log(`HTTPS Server is running on port ${httpsPort}`);
    console.log(`Local HTTPS access: https://localhost:${httpsPort}`);
    console.log(`Network HTTPS access: https://192.168.0.216:${httpsPort}`);
    console.log(`📱 For mobile access, use: https://192.168.0.216:${httpsPort}`);
    
    // Create test users after server starts and DB is connected
    setTimeout(createTestUsers, 1000);
});
