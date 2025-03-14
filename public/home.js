document.addEventListener('DOMContentLoaded', () => {
  const xrpBalanceSpan = document.getElementById('xrpBalance');
  const usdBalanceSpan = document.getElementById('usdBalance');
  const sendOrRequest = document.getElementById('sendOrRequest');
  const actionModal = document.getElementById('actionModal');
  const sendPayOption = document.getElementById('sendPayOption');
  const requestOption = document.getElementById('requestOption');
  const sendPayContent = document.getElementById('sendPayContent');
  const requestContent = document.getElementById('requestContent');

  // Debugging element existence
  console.log('Elements found:', {
    xrpBalanceSpan,
    usdBalanceSpan,
    sendOrRequest,
    actionModal,
    sendPayOption,
    requestOption,
    sendPayContent,
    requestContent
  });

  let html5QrCode;
  let isScannerRunning = false;

  console.log('Checking Html5Qrcode availability:', typeof Html5Qrcode !== 'undefined');
  if (typeof Html5Qrcode === 'undefined') {
    console.error('html5-qrcode library not loaded. Attempting to load dynamically.');
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js';
    script.onload = () => {
      console.log('html5-qrcode loaded dynamically');
    };
    script.onerror = () => console.error('Failed to load html5-qrcode dynamically');
    document.head.appendChild(script);
  }

  // Use localhost for WebSocket since you're testing locally
const ws = new WebSocket('ws://192.168.0.100:3000');

  ws.onopen = () => {
    console.log('WebSocket connection opened');
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  ws.onmessage = (event) => {
    console.log('WebSocket message received:', event.data);
    try {
      const data = JSON.parse(event.data);
      console.log('Parsed WebSocket data:', data);
      if (data.type === 'balance' && xrpBalanceSpan && usdBalanceSpan) {
        xrpBalanceSpan.textContent = data.xrpBalance || 'N/A';
        usdBalanceSpan.textContent = `= $${data.usdBalance || 'N/A'} USD`;
        console.log('Balance updated:', xrpBalanceSpan.textContent, usdBalanceSpan.textContent);
      } else if (data.type === 'payment') {
        alert(`Payment ${data.status}: ${data.tx.hash}`);
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
      xrpBalanceSpan.textContent = 'Error';
      usdBalanceSpan.textContent = '= $Error';
    }
  };

  // Fallback fetch if WebSocket isn’t sending initial balance
  async function fetchBalance() {
    try {
      const response = await fetch('/balance');
      if (!response.ok) throw new Error('Fetch failed');
      const data = await response.json();
      console.log('Fetched balance:', data);
      if (xrpBalanceSpan && usdBalanceSpan) {
        xrpBalanceSpan.textContent = data.xrpBalance;
        usdBalanceSpan.textContent = `= $${data.usdBalance} USD`;
      }
    } catch (error) {
      console.error('Fetch error:', error.message);
      if (xrpBalanceSpan && usdBalanceSpan) {
        xrpBalanceSpan.textContent = 'Error';
        usdBalanceSpan.textContent = '= $Error';
      }
    }
  }
  fetchBalance(); // Initial fetch
  // setInterval(fetchBalance, 300000); // Uncomment if WebSocket updates fail

  if (sendOrRequest) {
    sendOrRequest.addEventListener('click', () => {
      console.log('Send/Pay or Request button clicked');
      if (actionModal) {
        actionModal.style.display = 'block';
        showOption('sendPay');
      }
    });
  }

  if (actionModal) {
    actionModal.addEventListener('click', (e) => {
      if (e.target === actionModal) {
        actionModal.style.display = 'none';
        stopScanner();
      }
    });
  }

  if (sendPayOption) {
    sendPayOption.addEventListener('click', () => {
      showOption('sendPay');
    });
  }

  if (requestOption) {
    requestOption.addEventListener('click', () => {
      showOption('request');
    });
  }

  function showOption(optionName) {
    if (!sendPayOption || !requestOption || !sendPayContent || !requestContent) return;
    sendPayOption.classList.remove('active');
    requestOption.classList.remove('active');
    sendPayContent.classList.remove('active');
    requestContent.classList.remove('active');

    if (optionName === 'sendPay') {
      sendPayOption.classList.add('active');
      sendPayContent.classList.add('active');
      if (!isScannerRunning) startQrScanner();
    } else if (optionName === 'request') {
      requestOption.classList.add('active');
      requestContent.classList.add('active');
      stopScanner();
    }
  }

  function startQrScanner() {
    console.log('Starting QR scanner');
    if (typeof Html5Qrcode === 'undefined') {
      console.error('Html5Qrcode not available');
      return;
    }
    html5QrCode = new Html5Qrcode('qrScanner');
    const qrConfig = { fps: 10, qrbox: { width: 250, height: 250 } };
    html5QrCode.start(
      { facingMode: 'environment' },
      qrConfig,
      (decodedText) => {
        console.log('QR Code scanned:', decodedText);
        html5QrCode.stop();
        isScannerRunning = false;
        actionModal.style.display = 'none';
        // Add logic to handle scanned wallet address if needed
      },
      (error) => {
        console.log('QR scan error:', error);
      }
    ).then(() => {
      isScannerRunning = true;
    }).catch((err) => {
      console.error('Failed to start QR scanner:', err);
    });
  }

  function stopScanner() {
    if (html5QrCode && isScannerRunning) {
      html5QrCode.stop().then(() => {
        isScannerRunning = false;
        console.log('QR scanner stopped');
      }).catch((err) => console.error('Error stopping QR scanner:', err));
    }
  }
});
