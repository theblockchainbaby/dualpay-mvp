// Global state
let authToken = localStorage.getItem('authToken');

// DOM Elements
const authSection = document.getElementById('authSection');
const appSection = document.getElementById('appSection');
const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const qrCodeSection = document.getElementById('qrCodeSection');
const createWalletBtn = document.getElementById('createWallet');
const sendPaymentForm = document.getElementById('sendPaymentForm');
const requestPaymentForm = document.getElementById('requestPaymentForm');
const walletAddress = document.getElementById('walletAddress');
const walletBalance = document.getElementById('walletBalance');

// Check authentication status
function checkAuth() {
    if (authToken) {
        authSection.classList.add('hidden');
        appSection.classList.remove('hidden');
        updateWalletInfo();
    } else {
        authSection.classList.remove('hidden');
        appSection.classList.add('hidden');
    }
}

// Register new user
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (response.ok) {
            document.getElementById('qrCode').src = data.qrCode;
            document.getElementById('secretKey').textContent = data.secret;
            qrCodeSection.classList.remove('hidden');
            alert('Registration successful! Please scan the QR code with Google Authenticator.');
        } else {
            alert(data.error);
        }
    } catch (error) {
        alert('Registration failed: ' + error.message);
    }
});

// Login user
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const twoFactorCode = document.getElementById('loginTwoFactor').value;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password, twoFactorCode })
        });

        const data = await response.json();
        if (response.ok) {
            authToken = data.token;
            localStorage.setItem('authToken', authToken);
            checkAuth();
        } else {
            alert(data.error);
        }
    } catch (error) {
        alert('Login failed: ' + error.message);
    }
});

// Create wallet
createWalletBtn.addEventListener('click', async () => {
    try {
        const response = await fetch('/api/wallet/create', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        if (response.ok) {
            walletAddress.textContent = data.address;
            updateWalletInfo();
        } else {
            alert(data.error);
        }
    } catch (error) {
        alert('Failed to create wallet: ' + error.message);
    }
});

// Update wallet info
async function updateWalletInfo() {
    try {
        const response = await fetch('/api/wallet/balance', {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        const data = await response.json();
        if (response.ok) {
            walletBalance.textContent = data.balance;
        }
    } catch (error) {
        console.error('Failed to update wallet info:', error);
    }
}

// Send payment
sendPaymentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const destinationAddress = document.getElementById('destinationAddress').value;
    const amount = document.getElementById('sendAmount').value;

    try {
        const response = await fetch('/api/payment/send', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ destinationAddress, amount })
        });

        const data = await response.json();
        if (response.ok) {
            alert(`Payment sent successfully! Transaction hash: ${data.hash}`);
            updateWalletInfo();
        } else {
            alert(data.error);
        }
    } catch (error) {
        alert('Payment failed: ' + error.message);
    }
});

// Request payment
requestPaymentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const amount = document.getElementById('requestAmount').value;
    const memo = document.getElementById('requestMemo').value;

    try {
        const response = await fetch('/api/payment/request', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ amount, memo })
        });

        const data = await response.json();
        if (response.ok) {
            const qrCodeDiv = document.getElementById('paymentQRCode');
            qrCodeDiv.innerHTML = `<img src="${data.qrCode}" alt="Payment QR Code" class="qr-code">`;
        } else {
            alert(data.error);
        }
    } catch (error) {
        alert('Failed to generate payment request: ' + error.message);
    }
});

// Initialize
checkAuth();
setInterval(updateWalletInfo, 30000); // Update wallet info every 30 seconds
