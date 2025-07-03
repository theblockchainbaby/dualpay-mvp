# DualPay MVP 🚀
A modern, full-featured cryptocurrency wallet application with multi-asset support, trading capabilities, advanced portfolio management tools, and **mobile-optimized HTTPS support**.

## ✨ Key Features

### � **Mobile-First Design**
- **HTTPS Support**: Secure SSL connections for mobile Safari compatibility
- **Responsive Layout**: Optimized for iPhone, Android, tablet, and desktop
- **Touch-Friendly**: Large buttons and intuitive mobile navigation
- **Progressive Web App**: App-like experience on mobile devices

### 💳 **Multi-Asset Support**
- **Cryptocurrencies**: Bitcoin (BTC), Ethereum (ETH), XRP, Solana (SOL), Cardano (ADA)
- **Stablecoins**: RLUSD, USDT, USDC, WMUSD (Walmart USD)
- **Real-time Pricing**: Live market data integration
- **Large Visual Icons**: 120px crypto icons for enhanced mobile experience

### 🎨 **Modern Fintech UI/UX**
- **Dark Mode Design**: Sleek fintech-inspired interface with neon green accents
- **Robinhood-Style**: Modern aesthetic similar to popular fintech apps
- **Card-Based Layout**: Clean, organized information display
- **Smooth Animations**: Engaging user interactions and transitions
- **Local Asset Management**: All icons and assets served locally for reliability

### 📊 **Advanced Portfolio Dashboard**
- **Live Portfolio Chart**: Interactive Chart.js visualization (Jan-July historical data)
- **Neon Green Styling**: Modern fintech aesthetic with glowing elements
- **Dynamic Updates**: Real-time portfolio value tracking ($71,828 demo balance)
- **Responsive Charts**: Mobile-optimized data visualization

### 🧮 **Financial Planning Tools**
- **Compound Interest Calculator**: Built-in financial planning modal
- **Dashboard Integration**: Accessible via hamburger menu
- **Detailed Projections**: Yearly growth calculations and breakdowns
- **Interactive Interface**: User-friendly modal with real-time calculations

### 💸 **Complete Transaction Suite**
- **Send**: Multi-asset transaction capabilities with QR scanning
- **Receive**: QR code generation with BIP21/EIP-681 support
- **Swap**: Asset exchange functionality with real-time rates
- **POS Integration**: Point-of-sale payment processing for merchants

### 🔐 **Enhanced Security & Authentication**
- **HTTPS Encryption**: SSL/TLS security for all connections
- **User Authentication**: Secure JWT-based login system
- **Session Management**: Persistent, secure user sessions
- **Test Account System**: Multiple demo accounts for easy testing
- **KYC Integration**: Onfido verification with US region support

## 🛠️ Quick Start

### Prerequisites
- **Node.js** (v14 or higher)
- **npm** or yarn package manager
- **MongoDB** (local or cloud instance)

### Installation & Setup
1. **Clone the repository**:
   ```bash
   git clone https://github.com/theblockchainbaby/dualpay-mvp.git
   cd dualpay-mvp
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   HTTPS_PORT=3443
   MONGODB_URI=mongodb://localhost:27017/dualpay
   JWT_SECRET=your-secret-key
   ONFIDO_REGION=US
   ONFIDO_API_TOKEN=your-onfido-token
   ```

4. **Start the server**:
   ```bash
   npm start
   # or
   node server.js
   ```

5. **Access the application**:
   - **Desktop HTTP**: `http://localhost:3000`
   - **Mobile HTTPS**: `https://localhost:3443`
   - **Local Network**: `https://[your-ip]:3443`

## 📱 Mobile Access Instructions

### For iPhone/Safari Users:
1. Connect to the same Wi-Fi network as your development machine
2. Navigate to: `https://[your-local-ip]:3443`
3. Accept the self-signed certificate warning:
   - Tap **"Advanced"** 
   - Tap **"Proceed to [IP address] (unsafe)"**
4. Bookmark for easy access!

### Test Accounts
Ready-to-use demo accounts (auto-created on server start):

| Email | Username | Password | Description |
|-------|----------|----------|-------------|
| `demo@dualpay.com` | `demo` | `demopass` | Main demo account |
| `test@dualpay.com` | `test` | `password123` | Testing account |
| `test@example.com` | `testuser` | `password123` | Alternative test |

## 🌐 Deployment & Access

### Development Servers
- **HTTP Server**: `localhost:3000` (desktop development)
- **HTTPS Server**: `localhost:3443` (mobile testing)
- **Network Access**: `https://[local-ip]:3443` (mobile devices)

### Production Deployment
- **Live Demo**: [https://dualpay-mvp.onrender.com](https://dualpay-mvp.onrender.com) *(if deployed)*
- **SSL Certificates**: Self-signed for development, use proper certs for production
- **Environment**: Configure production environment variables

## 📱 Pages & Functionality

### Dashboard
- Portfolio overview with interactive chart
- Asset balances and current prices
- Quick action buttons (Send, Receive, Swap)
- Hamburger menu with Compound Interest Calculator
- Large crypto icons (48px) with clean presentation

### Send
- Multi-asset sending capabilities
- Support for all cryptocurrencies and stablecoins
- Transaction fee calculation
- Error handling for insufficient funds

### Receive
- QR code generation for payment requests
- Support for all supported assets
- Easy address sharing
- Large asset selection icons for better UX

### Swap
- Asset-to-asset exchange functionality
- Real-time conversion rates
- Support for crypto-to-crypto and crypto-to-stablecoin swaps
- Slippage protection

### POS (Point of Sale)
- Merchant payment processing
- QR code generation for customer payments
- Transaction confirmation system

## 🎯 Technical Highlights

### Frontend Technologies
- **HTML5/CSS3**: Modern responsive design with CSS Grid and Flexbox
- **JavaScript (ES6+)**: Clean, modular code with async/await patterns
- **Chart.js**: Interactive portfolio visualization with custom styling
- **Tailwind CSS**: Utility-first CSS framework for rapid development
- **QR Code Generation**: QRCode.js integration for payment requests
- **Local Asset Management**: Optimized icon and image serving

### Backend Technologies
- **Node.js**: Server-side JavaScript runtime with modern ES features
- **Express.js**: Web application framework with middleware support
- **MongoDB**: NoSQL database for user and transaction data
- **Mongoose**: ODM for MongoDB with schema validation
- **HTTPS/SSL**: Self-signed certificates for secure development
- **JWT Authentication**: Secure token-based authentication
- **WebSocket Support**: Real-time communication capabilities

### Security & Infrastructure
- **HTTPS Encryption**: SSL/TLS for all communications
- **Content Security Policy**: Helmet.js security headers
- **Session Management**: Express-session with secure cookies
- **Password Hashing**: bcryptjs for secure password storage
- **Environment Variables**: Secure configuration management
- **CORS Protection**: Cross-origin request security

### Key Technical Achievements
- **📱 Mobile-First HTTPS**: Full SSL implementation for Safari compatibility
- **🎨 Modern UI/UX**: Robinhood-inspired dark mode interface
- **📊 Live Charts**: Real-time portfolio visualization with Chart.js
- **🔐 Enhanced Security**: JWT authentication with secure session management
- **🪙 Multi-Asset Support**: 9 cryptocurrencies and stablecoins
- **⚡ Performance**: Optimized asset loading and local caching
- **♿ Accessibility**: WCAG compliant interface elements
- **📐 Responsive Design**: Mobile-first approach with Tailwind CSS
- **🛡️ Error Handling**: Comprehensive error management and user feedback
- **🔄 Auto-Updates**: Dynamic portfolio and price updates

## 💰 Supported Assets

| Asset | Symbol | Type | Network |
|-------|--------|------|---------|
| Bitcoin | BTC | Cryptocurrency | Bitcoin |
| Ethereum | ETH | Cryptocurrency | Ethereum |
| XRP | XRP | Cryptocurrency | XRP Ledger |
| Solana | SOL | Cryptocurrency | Solana |
| Cardano | ADA | Cryptocurrency | Cardano |
| Ripple USD | RLUSD | Stablecoin | XRP Ledger |
| Tether | USDT | Stablecoin | Multi-chain |
| USD Coin | USDC | Stablecoin | Multi-chain |
| Walmart USD | WMUSD | Stablecoin | Custom |

## 🔧 Configuration

### Environment Variables
```env
# Server Configuration
PORT=3000                          # HTTP server port
HTTPS_PORT=3443                    # HTTPS server port (for mobile)
NODE_ENV=development               # Environment mode

# Database
MONGODB_URI=mongodb://localhost:27017/dualpay  # MongoDB connection

# Security
JWT_SECRET=your-super-secret-key   # JWT token secret
SESSION_SECRET=your-session-secret # Session management secret

# KYC & Compliance
ONFIDO_API_TOKEN=your-onfido-token # Onfido API token
ONFIDO_REGION=US                   # Onfido region (US/EU/CA)

# Blockchain Integration
XRPL_NETWORK=testnet              # XRP Ledger network
```

### SSL Certificate Setup (Development)
The app automatically generates self-signed SSL certificates on first run:
```bash
# Certificates are stored in ssl/ directory
ssl/
├── cert.pem    # SSL certificate
└── key.pem     # Private key
```

For production, replace with proper SSL certificates from a Certificate Authority.

### KYC Configuration
The app uses **Onfido** for Know Your Customer (KYC) verification:

- **Regions Supported**: 
  - `EU` → Uses `api.eu.onfido.com`
  - `US` → Uses `api.us.onfido.com` 
  - `CA` → Uses `api.ca.onfido.com`
- **Default Region**: EU (if not specified)
- **Document Types**: Passport, National ID, Utility Bills
- **Verification Flow**: Document upload → Identity verification → Compliance check

### Wallet Configuration
- **Test Address**: `raVYEbj4zSwpJSz8XyrkfPENj7DEvhsw34`
- **Network**: XRPL Testnet
- **Seed**: Securely stored in server configuration

## 📈 Latest Updates & Changelog

### Version 3.0 - Mobile HTTPS & Enhanced Features *(Current)*
- 🔐 **HTTPS Support**: Full SSL implementation for mobile Safari compatibility
- 📱 **Mobile Optimization**: Enhanced mobile-first responsive design
- 🎯 **Auto User Creation**: Automatic test user generation on server start
- 🛡️ **Enhanced Security**: Improved authentication and session management
- 📊 **Chart Improvements**: Better mobile chart rendering and interactions
- 🪙 **Stablecoin Integration**: Added WMUSD (Walmart USD) support
- 🔧 **Developer Experience**: Simplified setup and configuration

### Version 2.0 - Complete UI Modernization
- ✅ **Dark Mode Redesign**: Complete UI/UX modernization
- ✅ **Expanded Assets**: 9 total cryptocurrencies and stablecoins
- ✅ **Interactive Charts**: Chart.js portfolio visualization (Jan-July data)
- ✅ **Compound Calculator**: Integrated financial planning tool
- ✅ **Enhanced Icons**: 120px asset icons for better mobile experience
- ✅ **Local Assets**: Comprehensive local asset management
- ✅ **Responsive Grid**: Mobile-optimized layout system

### Version 1.0 - Initial MVP
- 🏗️ **Core Functionality**: Basic wallet operations (send/receive/swap)
- 🔑 **Authentication**: User login and session management
- 🪙 **Multi-Asset**: Initial cryptocurrency support
- 📱 **Basic UI**: Foundational interface design

## 🤝 Contributing
We welcome contributions! Here's how to get started:

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/dualpay-mvp.git
   ```
3. **Create a feature branch**:
   ```bash
   git checkout -b feature/amazing-feature
   ```
4. **Make your changes** and test thoroughly
5. **Commit with descriptive messages**:
   ```bash
   git commit -m 'feat: Add amazing new feature'
   ```
6. **Push to your branch**:
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request** with a detailed description

### Development Guidelines
- Follow existing code style and conventions
- Test on both desktop and mobile devices
- Ensure HTTPS functionality works correctly
- Update documentation for new features
- Add appropriate error handling

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support & Contact
- **GitHub Issues**: [Create an issue](https://github.com/theblockchainbaby/dualpay-mvp/issues)
- **Feature Requests**: Use GitHub issues with the "enhancement" label
- **Bug Reports**: Include steps to reproduce and screenshots
- **Security Issues**: Please report privately via GitHub

## 🏆 Acknowledgments
- **Chart.js** for beautiful data visualization
- **Tailwind CSS** for rapid UI development
- **Onfido** for KYC integration services
- **XRP Ledger** for blockchain infrastructure
- **MongoDB** for reliable data storage

---

**DualPay MVP** - Bringing modern fintech UX to cryptocurrency wallet management with mobile-first HTTPS support.

🚀 **Ready to explore the future of digital payments?** Clone, setup, and start building today!
