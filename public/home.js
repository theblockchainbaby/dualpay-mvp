const ws = new WebSocket('ws://localhost:3000');
const tapArea = document.getElementById('tapArea');
const statusDiv = document.getElementById('status');
const balanceDiv = document.getElementById('balance');
const transactionsDiv = document.getElementById('transactions');
const actionButton = document.getElementById('actionButton');
const qrButton = document.getElementById('qrButton');
const qrModal = document.getElementById('qrModal');
const scanOption = document.getElementById('scanOption');
const myCodeOption = document.getElementById('myCodeOption');
const qrDisplay = document.getElementById('qrDisplay');
const qrImage = document.getElementById('qrImage');
const qrAddress = document.getElementById('qrAddress');
const qrScanner = document.getElementById('qrScanner');
const closeModal = document.getElementById('closeModal');

let html5QrCode;

// Fetch balance from server
async function fetchBalance() {
  try {
    const res = await fetch('/balance');
    const data = await res.json();
    balanceDiv.textContent = `${data.xrp} XRP | $${data.usd}`;
  } catch (err) {
    balanceDiv.textContent = 'Error loading balance';
    console.error(err);
  }
}

// Mock transaction history (replace with real data later)
function loadTransactions() {
  const mockTransactions = [
    { name: 'SAFE Visa Debit', type: 'Instant Transfer', date: '2/19/25', amount: '100.00 XRP', received: true },
    { name: 'NuNu', type: 'Received', date: '2/19/25', amount: '100.00 XRP', received: true },
    { name: 'Corbin', type: 'Sent', date: '2/14/25', amount: '80.00 XRP', received: false },
    { name: 'Cassidy Myers-Sims', type: 'Sent', date: '2/13/25', amount: '40.00 XRP', received: false },
    { name: 'NuNu', type: 'Sent', date: '2/7/25', amount: '300.00 XRP', received: false },
  ];

  transactionsDiv.innerHTML = mockTransactions.map(tx => `
    <div class="transaction-item flex items-center">
      <div class="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center mr-3">
        <span class="text-white">${tx.name.charAt(0)}</span>
      </div>
      <div class="flex-1">
        <p class="text-white font-semibold">${tx.name}</p>
        <p class="text-gray-400 text-sm">${tx.type} • ${tx.date}</p>
      </div>
      <div class="text-right">
        <p class="${tx.received ? 'text-green-400' : 'text-red-400'}">${tx.received ? '+' : '-'}${tx.amount}</p>
      </div>
    </div>
  `).join('');
}

// Tap-to-pay functionality
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === 'request') {
    tapArea.classList.remove('hidden');
    tapArea.textContent = `Pay $${data.amount}`;
    tapArea.onclick = () => {
      fetch('/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: data.amount, recipient: 'raVYEbj4zSwpJSz8XyrkfPENj7DEvhsw34', currency: 'usd' })
      })
      .then(res => res.json())
      .then(resData => {
        statusDiv.textContent = resData.message;
        tapArea.classList.add('hidden');
      })
      .catch(err => {
        statusDiv.textContent = 'Payment failed.';
        console.error(err);
      });
    };
  }
};

// QR Code Modal
qrButton.addEventListener('click', () => {
  qrModal.style.display = 'block';
  qrDisplay.classList.add('hidden');
  qrScanner.classList.add('hidden');
  scanOption.classList.remove('hidden');
  myCodeOption.classList.remove('hidden');
});

closeModal.addEventListener('click', () => {
  qrModal.style.display = 'none';
  if (html5QrCode) html5QrCode.stop();
});

scanOption.addEventListener('click', () => {
  scanOption.classList.add('hidden');
  myCodeOption.classList.add('hidden');
  qrScanner.classList.remove('hidden');
  html5QrCode = new Html5Qrcode('qrScanner');
  html5QrCode.start(
    { facingMode: 'environment' },
    { fps: 10, qrbox: 250 },
    (decodedText) => {
      html5QrCode.stop();
      qrModal.style.display = 'none';
      fetch('/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: '1', recipient: decodedText, currency: 'usd' }) // Mock amount
      })
      .then(res => res.json())
      .then(data => {
        statusDiv.textContent = data.message || 'Payment sent!';
      })
      .catch(err => {
        statusDiv.textContent = 'Payment failed.';
        console.error(err);
      });
    },
    (error) => {
      console.log('QR Scan Error:', error);
    }
  ).catch(err => {
    console.error('QR Start Error:', err);
    statusDiv.textContent = 'Failed to start QR scanner.';
  });
});

myCodeOption.addEventListener('click', async () => {
  scanOption.classList.add('hidden');
  myCodeOption.classList.add('hidden');
  qrDisplay.classList.remove('hidden');
  try {
    const res = await fetch('/generate-qr');
    const data = await res.json();
    qrImage.src = data.qr;
    qrAddress.textContent = data.address;
  } catch (err) {
    statusDiv.textContent = 'Failed to load QR code.';
    console.error(err);
  }
});

// Redirect to send/receive pages (mock for now)
actionButton.addEventListener('click', () => {
  window.location.href = '/send.html';
});

// Initialize
fetchBalance();
loadTransactions();
