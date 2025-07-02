document.addEventListener('DOMContentLoaded', () => {
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
            if (authSection) authSection.classList.add('hidden');
            if (appSection) appSection.classList.remove('hidden');
            if (window.location.pathname.includes('dashboard')) {
                updateWalletInfo();
            }
        } else {
            if (authSection) authSection.classList.remove('hidden');
            if (appSection) appSection.classList.add('hidden');
        }
    }

    // Register new user
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, email, password })
                });

                const data = await response.json();
                if (response.ok) {
                    alert('Registration successful! Please check your email for verification.');
                    window.location.href = '/login.html';
                } else {
                    alert(data.error);
                }
            } catch (error) {
                alert('Registration failed: ' + error.message);
            }
        });
    }

    // Login user
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const twoFactorCode = document.getElementById('twoFactorCode').value;

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
                    window.location.href = '/dashboard.html';
                } else {
                    alert(data.error);
                }
            } catch (error) {
                alert('Login failed: ' + error.message);
            }
        });
    }

    // Create wallet
    if (createWalletBtn) {
        createWalletBtn.addEventListener('click', async () => {
            try {
                const response = await fetch('/api/wallet/create', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                });

                const data = await response.json();
                if (response.ok) {
                    if(walletAddress) walletAddress.textContent = data.address;
                    updateWalletInfo();
                } else {
                    alert(data.error);
                }
            } catch (error) {
                alert('Failed to create wallet: ' + error.message);
            }
        });
    }

    // Update wallet info
    async function updateWalletInfo() {
        if (!authToken) return;
        try {
            const response = await fetch('/api/wallet/balance', {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            const data = await response.json();
            if (response.ok) {
                if (walletBalance) walletBalance.textContent = data.balance;
            }
        } catch (error) {
            console.error('Failed to update wallet info:', error);
        }
    }

    // Send payment
    if (sendPaymentForm) {
        sendPaymentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const destinationAddress = document.getElementById('destinationAddress').value;
            const amount = document.getElementById('sendAmount').value;

            try {
                const response = await fetch('/api/payment/send', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${authToken}`,'Content-Type': 'application/json'
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
    }

    // Request payment
    if (requestPaymentForm) {
        requestPaymentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const amount = document.getElementById('requestAmount').value;
            const memo = document.getElementById('requestMemo').value;

            try {
                const response = await fetch('/api/payment/request', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${authToken}`,'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ amount, memo })
                });

                const data = await response.json();
                if (response.ok) {
                    const qrCodeDiv = document.getElementById('paymentQRCode');
                    if(qrCodeDiv) qrCodeDiv.innerHTML = `<img src="${data.qrCode}" alt="Payment QR Code" class="qr-code">`;
                } else {
                    alert(data.error);
                }
            } catch (error) {
                alert('Failed to generate payment request: ' + error.message);
            }
        });
    }

    // Initialize
    checkAuth();
    if (authToken && window.location.pathname.includes('dashboard')) {
      setInterval(updateWalletInfo, 30000); // Update wallet info every 30 seconds
    }
});
