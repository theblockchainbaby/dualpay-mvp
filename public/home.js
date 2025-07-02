document.addEventListener('DOMContentLoaded', () => {
  if (typeof Html5Qrcode === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js';
    script.async = true;
    script.onload = () => console.log('Html5Qrcode loaded');
    script.onerror = () => console.error('Failed to load Html5Qrcode');
    document.head.appendChild(script);
  } else {
    console.log('Html5Qrcode already loaded');
  }

  const xrpBalanceSpan = document.getElementById('xrpBalance');
  const usdBalanceSpan = document.getElementById('usdBalance');
  const sendOrRequest = document.getElementById('sendOrRequest');
  const actionModal = document.getElementById('actionModal');
  const sendPayOption = document.getElementById('sendPayOption');
  const requestOption = document.getElementById('requestOption');
  const sendPayContent = document.getElementById('sendPayContent');
  const requestContent = document.getElementById('requestContent');

  let html5QrCode;
  let isScannerRunning = false;

  function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.display = 'block';
    setTimeout(() => {
      toast.style.display = 'none';
    }, 3000); // Hide after 3 seconds
  }

  function addTransaction({ name, date, amount, type }) {
    const transactionsDiv = document.querySelector('.transactions');
    const transaction = document.createElement('div');
    transaction.classList.add('transaction');
    transaction.innerHTML = `
      <div class="avatar">${name.charAt(0)}</div>
      <div class="transaction-details">
        <div class="transaction-name">${name}</div>
        <div class="transaction-date">${date}</div>
      </div>
      <div class="transaction-amount ${type}">${amount} XRP</div>
    `;
    transactionsDiv.insertBefore(transaction, transactionsDiv.children[1]); // After <h2>
    const transactionItems = transactionsDiv.querySelectorAll('.transaction');
    if (transactionItems.length > 5) {
      transactionsDiv.removeChild(transactionItems[transactionItems.length - 1]);
    }
  }

  function showOption(option) {
    if (option === 'sendPay') {
      sendPayOption.classList.add('active');
      requestOption.classList.remove('active');
      sendPayContent.classList.add('active');
      requestContent.classList.remove('active');
      startQrScanner();
    } else {
      sendPayOption.classList.remove('active');
      requestOption.classList.add('active');
      sendPayContent.classList.remove('active');
      requestContent.classList.add('active');
      if (isScannerRunning && html5QrCode) {
        html5QrCode.stop().then(() => {
          isScannerRunning = false;
          console.log('QR scanner stopped');
        }).catch((err) => {
          console.error('Error stopping QR scanner:', err);
        });
      }
    }
  }

  function startQrScanner() {
    console.log('Starting QR scanner');
    if (typeof Html5Qrcode === 'undefined') {
      console.error('Html5Qrcode not available');
      showToast('QR scanning not available. Please enter manually.');
      manualWalletInput();
      return;
    }
    html5QrCode = new Html5Qrcode('qrScanner');
    const qrConfig = { fps: 10, qrbox: { width: 250, height: 250 } };
    html5QrCode.start(
      { facingMode: 'environment' },
      qrConfig,
      (decodedText) => {
        console.log('QR Code scanned:', decodedText);
        document.getElementById('recipientAddress').value = decodedText;
        html5QrCode.stop().then(() => {
          isScannerRunning = false;
          console.log('QR scanner stopped after scan');
        }).catch((err) => {
          console.error('Error stopping QR scanner:', err);
        });
        actionModal.style.display = 'none';
        showToast('Recipient address scanned successfully');
      },
      (error) => {
        console.log('QR scan error:', error);
      }
    ).then(() => {
      isScannerRunning = true;
    }).catch((err) => {
      console.error('Failed to start QR scanner:', err);
      showToast('Failed to start QR scanner. Please enter manually.');
      manualWalletInput();
    });
  }

  function manualWalletInput() {
    showToast('Please enter the recipient address manually.');
  }

  if (sendOrRequest) {
    sendOrRequest.addEventListener('click', () => {
      console.log('Pay or Request button clicked');
      if (actionModal) {
        actionModal.style.display = 'block';
        showOption('sendPay');
      }
    });
  }

  if (sendPayOption) {
    sendPayOption.addEventListener('click', () => showOption('sendPay'));
  }

  if (requestOption) {
    requestOption.addEventListener('click', () => showOption('request'));
  }

  if (actionModal) {
    actionModal.addEventListener('click', (e) => {
      if (e.target === actionModal) {
        actionModal.style.display = 'none';
        if (isScannerRunning && html5QrCode) {
          html5QrCode.stop().then(() => {
            isScannerRunning = false;
            console.log('QR scanner stopped');
          }).catch((err) => {
            console.error('Error stopping QR scanner:', err);
          });
        }
      }
    });
  }

  const sendButton = document.getElementById('sendButton');
  if (sendButton) {
    sendButton.addEventListener('click', async () => {
      const recipient = document.getElementById('recipientAddress').value.trim();
      const amount = document.getElementById('sendAmount').value;
      const currency = document.getElementById('sendCurrency').value;
      if (!recipient || !amount || !currency) {
        showToast('Please fill in all fields');
        return;
      }
      try {
        const response = await fetch('/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount, recipient, currency })
        });
        const data = await response.json();
        if (response.ok) {
          showToast('Payment sent successfully: ' + data.txHash);
          document.getElementById('recipientAddress').value = '';
          document.getElementById('sendAmount').value = '';
        } else {
          showToast('Payment failed: ' + data.message);
        }
      } catch (error) {
        showToast('Error sending payment: ' + error.message);
      }
    });
  }

  const ws = new WebSocket('ws://192.168.0.210:3000');
  ws.onopen = () => console.log('WebSocket connected');
  ws.onmessage = (event) => {
    console.log('WebSocket message received:', event.data);
    try {
      const data = JSON.parse(event.data);
      console.log('Parsed WebSocket data:', data);
      if (data.type === 'balance' && xrpBalanceSpan && usdBalanceSpan) {
        xrpBalanceSpan.textContent = data.xrpBalance || 'N/A';
        usdBalanceSpan.textContent = data.usdBalance ? `= $${data.usdBalance} USD` : '= $N/A USD';
        console.log('Balance updated via WebSocket:', data.xrpBalance, data.usdBalance);
      } else if (data.type === 'payment') {
        showToast(`Payment ${data.status}: ${data.tx.hash}`);
      } else if (data.type === 'transaction') {
        addTransaction(data.transaction);
        showToast(`New transaction: ${data.transaction.amount} XRP to ${data.transaction.name}`);
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
      xrpBalanceSpan.textContent = 'Error';
      usdBalanceSpan.textContent = '= $Error';
    }
  };
  ws.onerror = (error) => console.error('WebSocket error:', error);
  ws.onclose = () => console.log('WebSocket disconnected');

  fetch('/balance')
    .then(response => {
      console.log('Fetch /balance response status:', response.status);
      return response.json();
    })
    .then(data => {
      console.log('Fetch /balance data:', data);
      xrpBalanceSpan.textContent = data.xrpBalance || 'N/A';
      usdBalanceSpan.textContent = data.usdBalance ? `= $${data.usdBalance} USD` : '= $N/A USD';
    })
    .catch(error => {
      console.error('Manual balance fetch error:', error);
      xrpBalanceSpan.textContent = 'Error';
      usdBalanceSpan.textContent = '= $Error';
    });
});
