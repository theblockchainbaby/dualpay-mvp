const express = require('express');
const xrpl = require('xrpl');
const path = require('path');
const { convertXrpToFiat } = require('./fiatConversion');

console.log('Starting server...');
const wallet = xrpl.Wallet.fromSeed('sEdVawtBsNiiRba4AA9Mhig99JgdQmr');
console.log('Wallet initialized:', wallet.address);

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

async function getBalance(client) {
  const accountInfo = await client.request({
    command: 'account_info',
    account: wallet.address,
  });
  return xrpl.dropsToXrp(accountInfo.result.account_data.Balance);
}

app.post('/send', async (req, res) => {
  console.log('POST /send hit');
  const { amount, recipient } = req.body;
  console.log('Request body:', { amount, recipient });
  if (!amount || !recipient) {
    return res.status(400).json({ success: false, error: 'Missing amount or recipient' });
  }
  const amountNum = parseFloat(amount);
  if (amountNum <= 0) {
    return res.status(400).json({ success: false, error: 'Amount must be positive' });
  }

  const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233');
  try {
    await client.connect();
    console.log('Connected to Testnet');

    const balance = await getBalance(client);
    if (balance < amountNum + 0.000012) {
      throw new Error(`Insufficient funds: ${balance} XRP available`);
    }

    const prepared = await client.autofill({
      TransactionType: 'Payment',
      Account: wallet.address,
      Amount: xrpl.xrpToDrops(amountNum),
      Destination: recipient,
    });
    console.log('Transaction prepared');
    const signed = wallet.sign(prepared);
    console.log('Transaction signed');
    const result = await client.submitAndWait(signed.tx_blob);
    console.log('Transaction result:', result.result.meta.TransactionResult);

    const fiatAmount = await convertXrpToFiat(amountNum);
    console.log(`Fiat value: ${fiatAmount.toFixed(2)} USD`);

    if (result.result.meta.TransactionResult === 'tesSUCCESS') {
      res.json({ success: true, txHash: result.result.hash, fiatAmount: fiatAmount.toFixed(2) });
    } else {
      res.status(500).json({ success: false, error: `Transaction failed: ${result.result.meta.TransactionResult}` });
    }
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    await client.disconnect();
    console.log('Disconnected');
  }
});

app.get('/balance', async (req, res) => {
  const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233');
  try {
    await client.connect();
    console.log('Fetching balance for:', wallet.address);
    const balance = await getBalance(client);
    res.json({ success: true, balance });
  } catch (error) {
    console.error('Balance error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    await client.disconnect();
  }
});

// Serve home page by default
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

// Serve send page
app.get('/send', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'send.html'));
});

// Serve receive page
app.get('/receive', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'receive.html'));
});

app.listen(3000, () => console.log('Server running at http://localhost:3000'));
