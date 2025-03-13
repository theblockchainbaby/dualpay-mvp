const express = require('express');
const { Client, Wallet } = require('xrpl');
const WebSocket = require('ws');
const QRCode = require('qrcode');
const app = express();
const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.json());
app.use(express.static('public'));
app.use('/node_modules', express.static('node_modules'));

const client = new Client('wss://s.altnet.rippletest.net:51233');
const wallet = Wallet.fromSeed('sEd7oS7pWhHoNyzrJkeSSnT4xZ8NCRm'); // Replace with your seed

async function connectXRPL() {
  await client.connect();
  console.log('Connected to XRPL WebSocket');
}
connectXRPL();

wss.on('connection', (ws) => {
  console.log('Client connected to WebSocket');
  ws.on('message', (message) => {
    const data = JSON.parse(message);
    if (data.type === 'request') {
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'request', amount: data.amount }));
        }
      });
    }
  });
});

app.get('/balance', async (req, res) => {
  try {
    const accountInfo = await client.request({
      command: 'account_info',
      account: wallet.address,
      ledger_index: 'validated'
    });
    const xrpBalance = (parseInt(accountInfo.result.account_data.Balance) / 1000000).toFixed(2);
    const usdBalance = (xrpBalance * 2).toFixed(2);
    res.json({ xrp: xrpBalance, usd: usdBalance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch balance' });
  }
});

app.get('/generate-qr', async (req, res) => {
  try {
    const qrDataUrl = await QRCode.toDataURL(wallet.address);
    res.json({ qr: qrDataUrl, address: wallet.address });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

app.post('/send', async (req, res) => {
  const { amount, recipient, currency } = req.body;
  const xrpAmount = (parseFloat(amount) * 2 * 1000000).toString();
  const tx = {
    TransactionType: 'Payment',
    Account: wallet.address,
    Amount: xrpAmount,
    Destination: recipient,
    Fee: '12',
    LastLedgerSequence: (await client.getLedgerIndex()) + 20
  };
  try {
    const prepared = await client.autofill(tx);
    const signed = wallet.sign(prepared);
    const result = await client.submitAndWait(signed.tx_blob);
    if (result.result.meta.TransactionResult === 'tesSUCCESS') {
      res.json({ message: `Sent $${amount} to ${recipient}` });
    } else {
      res.status(500).json({ message: 'Transaction failed' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Payment error' });
  }
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
  console.log('Wallet initialized:', wallet.address);
});
