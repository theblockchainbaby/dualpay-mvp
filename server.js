const express = require('express');
const xrpl = require('xrpl');
const path = require('path');
const { convertXrpToFiat } = require('./fiatConversion');
const { verifyPasscode } = require('./auth');

console.log('Starting server...');
const wallet = xrpl.Wallet.fromSeed('sEdVawtBsNiiRba4AA9Mhig99JgdQmr');
console.log('Wallet initialized:', wallet.address);

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

async function getBalance(client) {
  const accountInfo = await client.request({ command: 'account_info', account: wallet.address });
  return xrpl.dropsToXrp(accountInfo.result.account_data.Balance);
}

app.post('/login', (req, res) => {
  const { passcode } = req.body;
  if (verifyPasscode(passcode)) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, error: 'Invalid passcode' });
  }
});
app.post('/send', async (req, res) => {
  const { amount, recipient, currency = 'usd' } = req.body;
  console.log('POST /send hit with:', { amount, recipient, currency });
  const amountNum = parseFloat(amount);
  if (!amountNum || amountNum <= 0) {
    return res.status(400).json({ success: false, error: 'Invalid amount' });
  }
  if (!recipient || !xrpl.isValidAddress(recipient)) {
    return res.status(400).json({ success: false, error: 'Invalid recipient address' });
  }

  const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233');
  try {
    await client.connect();
    console.log('Connected to Testnet');
    const balance = await getBalance(client);
    console.log(`Current balance: ${balance} XRP`);
    if (balance < amountNum + 0.000012) {
      throw new Error(`Insufficient funds: ${balance} XRP available, need ${amountNum + 0.000012} XRP`);
    }

    const prepared = await client.autofill({
      TransactionType: 'Payment',
      Account: wallet.address,
      Amount: xrpl.xrpToDrops(amountNum),
      Destination: recipient,
    });
    console.log('Transaction prepared:', prepared);
    const signed = wallet.sign(prepared);
    console.log('Transaction signed:', signed.tx_blob);
    const result = await client.submitAndWait(signed.tx_blob);
    console.log('Transaction result:', result);

    const fiatAmount = await convertXrpToFiat(amountNum, currency);
    if (result.result.meta.TransactionResult === 'tesSUCCESS') {
      console.log(`Success: ${result.result.hash}, Fiat: ${fiatAmount.toFixed(2)} ${currency.toUpperCase()}`);
      res.json({ success: true, txHash: result.result.hash, fiatAmount: fiatAmount.toFixed(2), currency: currency.toUpperCase() });
    } else {
      throw new Error(`Transaction failed with result: ${result.result.meta.TransactionResult}`);
    }
  } catch (error) {
    console.error('Send error:', error.message, error.stack);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    await client.disconnect();
    console.log('Disconnected from Testnet');
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
  const txId = Date.now().toString(); // Mock transaction ID
  res.json({ success: true, address: wallet.address, txId, xrpAmount });
});

app.get('/check-payment/:txId', async (req, res) => {
  // Simulate payment check (replace with XRP Ledger listener in production)
  res.json({ status: 'completed', fiatAmount: 'mocked' });
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')));
app.get('/home', (req, res) => res.sendFile(path.join(__dirname, 'public', 'home.html')));
app.get('/send', (req, res) => res.sendFile(path.join(__dirname, 'public', 'send.html')));
app.get('/receive', (req, res) => res.sendFile(path.join(__dirname, 'public', 'receive.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')));
app.get('/pos', (req, res) => res.sendFile(path.join(__dirname, 'public', 'pos.html')));

app.listen(3000, () => console.log('Server running at http://localhost:3000'));
