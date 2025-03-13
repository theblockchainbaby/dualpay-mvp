const express = require('express');
const xrpl = require('xrpl');
const path = require('path');
const { convertXrpToFiat } = require('./fiatConversion');
const { verifyPasscode } = require('./auth');
const WebSocket = require('ws');

console.log('Starting server...');
const wallet = xrpl.Wallet.fromSeed('sEdVawtBsNiiRba4AA9Mhig99JgdQmr');
console.log('Wallet initialized:', wallet.address);

const app = express();
const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// WebSocket setup for real-time notifications
wss.on('connection', (ws) => {
  console.log('Client connected to WebSocket');
  ws.on('close', () => console.log('Client disconnected from WebSocket'));
});

// XRPL WebSocket client for transaction monitoring
const xrplClient = new xrpl.Client('wss://s.altnet.rippletest.net:51233');
async function setupXrplSubscription() {
  await xrplClient.connect();
  console.log('Connected to XRPL WebSocket');
  await xrplClient.request({
    command: 'subscribe',
    accounts: [wallet.address]
  });
  xrplClient.on('transaction', (tx) => {
    // Validate transaction data before processing
    if (!tx || !tx.transaction || !tx.transaction.TransactionType) {
      console.log('Invalid transaction event received:', tx);
      return;
    }
    if (tx.transaction.TransactionType === 'Payment' &&
        (tx.transaction.Account === wallet.address || tx.transaction.Destination === wallet.address)) {
      const type = tx.transaction.Account === wallet.address ? 'Sent' : 'Received';
      const amount = xrpl.dropsToXrp(tx.transaction.Amount);
      const notification = `${type} ${amount} XRP ${type === 'Sent' ? 'to' : 'from'} ${type === 'Sent' ? tx.transaction.Destination : tx.transaction.Account}`;
      console.log('Transaction detected:', notification);
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'notification', message: notification }));
        }
      });
    }
  });
}
setupXrplSubscription().catch((error) => console.error('XRPL Subscription Error:', error));

async function getBalance(client) {
  const accountInfo = await client.request({ command: 'account_info', account: wallet.address });
  return xrpl.dropsToXrp(accountInfo.result.account_data.Balance);
}

app.post('/login', (req, res) => {
  const { passcode } = req.body;
  console.log('POST /login received with passcode:', passcode);
  if (verifyPasscode(passcode)) {
    console.log('Passcode verified, sending success');
    res.json({ success: true });
  } else {
    console.log('Passcode invalid');
    res.status(401).json({ success: false, error: 'Invalid passcode' });
  }
});

app.post('/send', async (req, res) => {
  const { amount, recipient, currency = 'usd' } = req.body;
  console.log('POST /send hit with:', { amount, recipient, currency });
  const amountNum = parseFloat(amount);
  if (!amountNum || amountNum <= 0) return res.status(400).json({ success: false, error: 'Invalid amount' });
  if (!recipient || !xrpl.isValidAddress(recipient)) return res.status(400).json({ success: false, error: 'Invalid recipient address' });
  const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233');
  try {
    await client.connect();
    const balance = await getBalance(client);
    if (balance < amountNum + 0.000012) throw new Error(`Insufficient funds: ${balance} XRP`);
    const prepared = await client.autofill({
      TransactionType: 'Payment',
      Account: wallet.address,
      Amount: xrpl.xrpToDrops(amountNum),
      Destination: recipient,
      LastLedgerSequence: (await client.getLedgerIndex()) + 20 // Increase buffer to 20 ledgers
    });
    const signed = wallet.sign(prepared);
    const result = await client.submitAndWait(signed.tx_blob);
    const fiatAmount = await convertXrpToFiat(amountNum, currency);
    if (result.result.meta.TransactionResult === 'tesSUCCESS') {
      res.json({ success: true, txHash: result.result.hash, fiatAmount: fiatAmount.toFixed(2), currency: currency.toUpperCase() });
    } else {
      throw new Error(`Transaction failed: ${result.result.meta.TransactionResult}`);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  } finally {
    await client.disconnect();
  }
});

app.get('/balance', async (req, res) => {
  const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233');
  try {
    await client.connect();
    const balance = await getBalance(client);
    res.json({ success: true, balance });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  } finally {
    await client.disconnect();
  }
});

app.post('/pos-payment', async (req, res) => {
  const { amount, currency } = req.body;
  const amountNum = parseFloat(amount);
  const xrpAmount = amountNum / (await convertXrpToFiat(1, currency));
  const txId = Date.now().toString();
  res.json({ success: true, address: wallet.address, txId, xrpAmount });
});

app.get('/check-payment/:txId', async (req, res) => {
  res.json({ status: 'completed', fiatAmount: 'mocked' });
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')));
app.get('/home', (req, res) => res.sendFile(path.join(__dirname, 'public', 'home.html')));
app.get('/send', (req, res) => res.sendFile(path.join(__dirname, 'public', 'send.html')));
app.get('/receive', (req, res) => res.sendFile(path.join(__dirname, 'public', 'receive.html')));
app.get('/pos', (req, res) => res.sendFile(path.join(__dirname, 'public', 'pos.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')));

server.listen(3000, () => console.log('Server running at http://localhost:3000'));
