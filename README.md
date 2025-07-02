# DualPay MVP
A modern, full-featured cryptocurrency wallet application with multi-asset support, trading capabilities, and advanced portfolio management tools.

## 🚀 Features

### 💳 Multi-Asset Support
- **Cryptocurrencies**: Bitcoin (BTC), Ethereum (ETH), XRP, Solana (SOL), Cardano (ADA)
- **Stablecoins**: RLUSD, USDT, USDC, WMUSD (Walmart USD)
- Real-time price tracking and balance display
- Large, visually prominent asset selection icons (120px)

### 🎨 Modern UI/UX
- **Dark Mode Design**: Sleek fintech-inspired interface
- **Responsive Layout**: Optimized for desktop, tablet, and mobile
- **Consistent Branding**: Professional green accent colors (#10B981)
- **Card-Based Layout**: Clean, organized information display
- **Local Asset Management**: All icons and assets served locally for reliability

### 📊 Portfolio Management
- **Live Portfolio Chart**: Interactive Chart.js visualization showing Jan-July balance history
- **Neon Green Styling**: Modern fintech aesthetic similar to Robinhood/CashApp
- **Dynamic Updates**: Real-time portfolio value tracking
- **Balance Overview**: Quick view of total portfolio value

### 🧮 Financial Tools
- **Compound Interest Calculator**: Built-in financial planning tool
- **Accessible via Dashboard**: Located in hamburger menu for easy access
- **Detailed Breakdown**: Shows yearly growth projections
- **Interactive Results**: Modal-based interface with comprehensive calculations

### 💸 Transaction Features
- **Send**: Multi-asset transaction capabilities
- **Receive**: QR code generation for easy payments
- **Swap**: Asset exchange functionality
- **POS Integration**: Point-of-sale payment processing

### 🔐 Security & Authentication
- **User Authentication**: Secure login/logout system
- **Session Management**: Persistent user sessions
- **Test Users**: Pre-configured demo accounts for testing
- **Secure Wallet Storage**: Protected seed phrase management

## 🛠️ Setup Locally

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation
1. **Clone the repository**:
   ```bash
   git clone https://github.com/theblockchainbaby/dualpay-mvp.git
   cd dualpay-mvp
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

4. **Open in browser**:
   Navigate to `http://localhost:3000`

### Test Users
For testing purposes, you can use these demo accounts:
- **Username**: `testuser` | **Password**: `password123`
- **Username**: `demo` | **Password**: `demo123`

## 🌐 Deployment
**Live Application**: [https://dualpay-mvp.onrender.com](https://dualpay-mvp.onrender.com)

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
- **HTML5/CSS3**: Modern responsive design
- **JavaScript (ES6+)**: Clean, modular code structure
- **Chart.js**: Interactive portfolio visualization
- **Tailwind CSS**: Utility-first CSS framework
- **Local Asset Management**: Optimized icon and image serving

### Backend Technologies
- **Node.js**: Server-side JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB**: Database for user and transaction data
- **XRPL Integration**: XRP Ledger connectivity

### Key Improvements
- **Performance**: Optimized asset loading and caching
- **Accessibility**: WCAG compliant interface elements
- **Mobile-First**: Responsive design for all screen sizes
- **Error Handling**: Comprehensive error management and user feedback
- **Security**: Enhanced authentication and session management

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
- `PORT`: Server port (default: 3000)
- `MONGODB_URI`: MongoDB connection string
- `XRPL_NETWORK`: XRP Ledger network (testnet/mainnet)

### Wallet Configuration
- **Test Address**: `raVYEbj4zSwpJSz8XyrkfPENj7DEvhsw34`
- **Network**: XRPL Testnet
- **Seed**: Securely stored in server configuration

## 📈 Recent Updates

### Version 2.0 Features
- ✅ Complete UI/UX modernization with dark mode
- ✅ Expanded multi-asset support (9 total assets)
- ✅ Interactive portfolio chart with historical data
- ✅ Compound Interest Calculator integration
- ✅ Enhanced asset icon presentation
- ✅ Stablecoin support (RLUSD, USDT, USDC, WMUSD)
- ✅ Responsive design improvements
- ✅ Local asset management system

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support
For support and questions, please open an issue on GitHub or contact the development team.

---

**DualPay MVP** - Bringing modern fintech UX to cryptocurrency wallet management.
