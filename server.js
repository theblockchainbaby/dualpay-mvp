const express = require('express');
const WebSocket = require('ws');
const xrpl = require('xrpl');
const axios = require('axios');
const app = express();
const port = 3000;

// Serve static files from the 'public' directory
app.use(express.static('public'));

app.use(express.json());

const wss = new WebSocket.Server({ port: 8080 });

let client;
let wallet;
let lastKnownPrice = 0;
let lastPriceFetchTime = 0;
const PRICE_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

async function initialize() {
  client = new xrpl.Client('wss://s.altnet.rippletest.net:51233');
  await client.connect();
  console.log('Connected to XRPL WebSocket');

  wallet = xrpl.Wallet.fromSeed('sEd7n8PDAjj1gKDL8JAtJH8PhHAywA8');
  console.log('Wallet initialized:', wallet.address);

  await updateBalance();
}

async function updateBalance() {
  try {
    const accountInfo = await client.request({
      command: 'account_info',
      account: wallet.address,
      ledger_index: 'validated',
    });
    const xrpBalance = accountInfo.result.account_data.Balance / 1000000;
    console.log('Fetched XRP balance:', xrpBalance);

    let xrpPrice = lastKnownPrice;
    const now = Date.now();
    if (now - lastPriceFetchTime >= PRICE_CACHE_DURATION) {
      try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ripple&vs_currencies=usd');
        xrpPrice = lastKnownPrice = response.data.ripple.usd;
        lastPriceFetchTime = now;
        console.log('Fetched XRP price from CoinGecko:', xrpPrice);
      } catch (coinGeckoError) {
        console.error('CoinGecko API error:', coinGeckoError.message);
        if (coinGeckoError.response && coinGeckoError.response.status === 429) {
          console.log('Rate limit exceeded, using last known price:', xrpPrice);
        }
      }
    } else {
      console.log('Using cached XRP price:', xrpPrice);
    }
    const usdBalance = xrpBalance * xrpPrice;

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: 'balance', xrpBalance: xrpBalance.toFixed(2), usdBalance: usdBalance.toFixed(2) }));
      }
    });
  } catch (error) {
    console.error('Balance update error:', error.message);
  }
}

setInterval(updateBalance, 60000); // Update balance every minute

app.get('/balance', async (req, res) => {
  console.log('Received request for /balance');
  try {
    const accountInfo = await client.request({
      command: 'account_info',
      account: wallet.address,
      ledger_index: 'validated',
    });
    const xrpBalance = accountInfo.result.account_data.Balance / 1000000;
    console.log('Fetched XRP balance for /balance:', xrpBalance);
    let xrpPrice = lastKnownPrice;
    const now = Date.now();
    if (now - lastPriceFetchTime >= PRICE_CACHE_DURATION) {
      try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ripple&vs_currencies=usd');
        xrpPrice = lastKnownPrice = response.data.ripple.usd;
        lastPriceFetchTime = now;
        console.log('Fetched XRP price for /balance from CoinGecko:', xrpPrice);
      } catch (coinGeckoError) {
        console.error('CoinGecko API error:', coinGeckoError.message);
        if (coinGeckoError.response && coinGeckoError.response.status === 429) {
          console.log('Rate limit exceeded, using last known price:', xrpPrice);
        }
      }
    } else {
      console.log('Using cached XRP price for /balance:', xrpPrice);
    }
    const usdBalance = xrpBalance * xrpPrice;
    res.json({ xrpBalance: xrpBalance.toFixed(2), usdBalance: usdBalance.toFixed(2) });
  } catch (error) {
    console.error('Balance fetch error:', error.message);
    res.status(500).json({ xrpBalance: '0.00', usdBalance: '0.00' });
  }
});

app.post('/send', async (req, res) => {
  console.log('POST /send hit with:', req.body);
  const { amount, recipient, currency } = req.body;

  // Validate input
  if (!amount || !recipient || !currency) {
    return res.status(400).json({ message: 'Missing required fields: amount, recipient, and currency are required' });
  }

  if (currency !== 'XRP') {
    return res.status(400).json({ message: 'Only XRP currency is supported at this time' });
  }

  if (!recipient.startsWith('r') || recipient.length < 25 || recipient.length > 35) {
    return res.status(400).json({ message: 'Invalid recipient address: Must be a valid XRP address starting with "r" and 25-35 characters long' });
  }

  try {
    const amountInDrops = parseFloat(amount) * 1000000; // Convert XRP to drops
    const payment = {
      TransactionType: 'Payment',
      Account: wallet.address,
      Amount: amountInDrops.toString(),
      Destination: recipient,
    };

    const signedTx = wallet.sign(payment);
    const result = await client.submitAndWait(signedTx.tx_blob);
    console.log('Payment result:', result);

    if (result.result.meta.TransactionResult === 'tesSUCCESS') {
      // Broadcast to WebSocket clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'payment', status: 'success', tx: result.result }));
        }
      });

      // Update balance after transaction
      await updateBalance();

      res.json({ message: 'Payment sent successfully', txHash: result.result.hash });
    } else {
      res.status(500).json({ message: 'Payment failed on ledger', result: result.result.meta.TransactionResult });
    }
  } catch (error) {
    console.error('Payment error:', error.message);
    res.status(500).json({ message: 'Payment failed: ' + error.message });
  }
});

wss.on('connection', (ws) => {
  console.log('Client connected to WebSocket');
  ws.on('message', (message) => {
    console.log('Received WebSocket message:', message);
  });
  ws.on('close', () => {
    console.log('Client disconnected from WebSocket');
  });
});

initialize().then(() => {
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${port}`);
  });
}).catch((error) => {
  console.error('Initialization error:', error);
});
