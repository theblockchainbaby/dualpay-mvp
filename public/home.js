const ws = new WebSocket('ws://localhost:3000');
const balanceSpan = document.getElementById('balance');
const sendOrRequest = document.getElementById('sendOrRequest');
const actionModal = document.getElementById('actionModal');
const sendPayOption = document.getElementById('sendPayOption');
const requestOption = document.getElementById('requestOption');
const sendPayContent = document.getElementById('sendPayContent');
const requestContent = document.getElementById('requestContent');
let html5QrCode;
let isScannerRunning = false;

// Check if Html5Qrcode is available
console.log('Html5Qrcode available:', typeof Html5Qrcode !== 'undefined');
if (typeof Html5Qrcode === 'undefined') {
  console.error('html5-qrcode library not loaded. Attempting to load dynamically.');
  const script = document.createElement('script');
  script.src = 'https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js';
  script.onload = () => console.log('html5-qrcode loaded dynamically');
  script.onerror = () => console.error('Failed to load html5-qrcode dynamically');
  document.head.appendChild(script);
}

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === 'balance') {
    balanceSpan.textContent = data.balance.toFixed(2);
  } else if (data.type === 'payment') {
    alert(`Payment ${data.status}: ${data.tx.hash}`);
  }
};

sendOrRequest.addEventListener('click', () => {
  console.log('Send/Pay or Request button clicked');
  actionModal.style.display = 'block';
  showOption('sendPay');
});

actionModal.addEventListener('click', (e) => {
  if (e.target === actionModal) {
    actionModal.style.display = 'none';
    stopScanner();
  }
});

sendPayOption.addEventListener('click', () => {
  console.log('Send/Pay tab clicked, attempting to switch');
  showOption('sendPay');
});
requestOption.addEventListener('click', () => {
  console.log('Request tab clicked');
  showOption('request');
});

function showOption(optionName) {
  sendPayOption.classList.remove('active');
  requestOption.classList.remove('active');
  sendPayContent.classList.remove('active');
  requestContent.classList.remove('active');

  if (optionName === 'sendPay' && typeof Html5Qrcode !== 'undefined') {
    console.log('Activating Send/Pay tab');
    sendPayOption.classList.add('active');
    sendPayContent.classList.add('active');
    if (!isScannerRunning || !html5QrCode) {
      console.log('Scanner not running or not initialized, starting new scanner');
      startQrScanner();
    } else {
      console.log('Scanner already running, skipping restart');
    }
  } else if (optionName === 'request') {
    console.log('Activating Request tab');
    requestOption.classList.add('active');
    requestContent.classList.add('active');
    stopScanner();
  } else if (optionName === 'sendPay' && typeof Html5Qrcode === 'undefined') {
    console.error('Html5Qrcode not available yet. Please try again.');
    alert('QR scanning is not available. Please refresh the page or check your network.');
  }
}

function startQrScanner() {
  console.log('Starting QR scanner');
  try {
    if (html5QrCode && isScannerRunning) {
      html5QrCode.stop().then(() => {
        console.log('Previous scanner stopped');
        isScannerRunning = false;
        proceedWithNewScanner();
      }).catch(err => {
        console.error('Error stopping previous scanner:', err);
        isScannerRunning = false;
        proceedWithNewScanner();
      });
    } else {
      proceedWithNewScanner();
    }
  } catch (err) {
    console.error('Error initializing QR scanner setup:', err);
    alert('Error initializing QR scanner setup: ' + err);
    isScannerRunning = false;
  }
}

function proceedWithNewScanner() {
  console.log('Initializing new QR scanner');
  html5QrCode = new Html5Qrcode('qrScanner');
  html5QrCode.start(
    { facingMode: 'environment' },
    { fps: 10, qrbox: { width: 250, height: 250 } },
    (decodedText) => {
      console.log('QR code scanned:', decodedText);
      stopScanner();
      actionModal.style.display = 'none';
      initiatePayment(decodedText);
    },
    (errorMessage) => {
      console.error('QR Scan Error:', errorMessage);
    }
  ).then(() => {
    console.log('Camera started successfully');
    isScannerRunning = true;
  }).catch((err) => {
    console.error('Failed to start camera:', err);
    alert('Failed to start camera: ' + err);
    isScannerRunning = false;
  });
}

function stopScanner() {
  if (html5QrCode && isScannerRunning) {
    html5QrCode.stop().then(() => {
      console.log('Camera stopped successfully');
      isScannerRunning = false;
    }).catch(err => {
      console.error('Error stopping camera:', err);
      isScannerRunning = false;
    });
  } else {
    console.log('No scanner running to stop');
    isScannerRunning = false;
  }
}

function initiatePayment(address) {
  const amount = prompt('Enter amount in USD:');
  if (!amount || amount <= 0) {
    alert('Please enter a valid amount.');
    return;
  }
  fetch('/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, recipient: address, currency: 'usd' })
  })
  .then(res => res.json())
  .then(data => {
    alert(data.message || 'Payment sent!');
  })
  .catch(err => {
    alert('Payment failed.');
    console.error(err);
  });
}
