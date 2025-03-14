const express = require('express');
const { Client, Wallet } = require('xrpl');
const WebSocket = require('ws');
const path = require('path');
const axios = require('axios');

const app = express();
app.use(express.json());
app.use(express.static('public'));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

const server = app.listen(3000, '0.0.0.0', () => console.log('Server running at http://0.0.0.0:3000'));
const wss = new WebSocket.Server({ server });
const client = new Client('wss://s.altnet.rippletest.net:51233');
const wallet = Wallet.fromSeed('sEd7oS7pWhHoNyzrJkeSSnT4xZ8NCRm'); // Matches rCP2PFbY3VqyomvwBqe2tmfdH5h9CiUUo

console.log('Starting server...');
console.log('Wallet initialized:', wallet.address);

// Define routes
app.get('/qr', (req, res) => res.sendFile(path.join(__dirname, 'xrp-qr.png')));

app.post('/login', (req, res) => {
  const { passcode } = req.body;
  console.log('POST /login received with passcode:', passcode);
  if (passcode === '1234') {
    console.log('Passcode verified, sending success');
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: 'Invalid passcode' });
  }
});

app.post('/send', async (req, res) => {
  const { amount, recipient, currency } = req.body;
  console.log('POST /send hit with:', { amount, recipient, currency });
  if (!amount || !recipient || !currency) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  try {
    const drops = Math.floor(parseFloat(amount) * 1000000).toString();
    const payment = {
      TransactionType: 'Payment',
      Account: wallet.address,
      Amount: drops,
      Destination: recipient,
      Fee: '12',
      Flags: 0,
      LastLedgerSequence: (await client.getLedgerIndex()) + 20,
    };
    const prepared = await client.autofill(payment);
    const signed = wallet.sign(prepared);
    const result = await client.submitAndWait(signed.tx_blob);
    if (result.result.engine_result === 'tesSUCCESS') {
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'payment', status: 'success', tx: result.result }));
        }
      });
      res.json({ message: 'Payment sent successfully', txHash: result.result.hash });
    } else {
      res.status(500).json({ message: 'Payment failed', result: result.result });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Payment error', error: error.message });
  }
});

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
    let xrpPrice = 2.27; // Fallback price to avoid frequent CoinGecko calls
    const now = Date.now();
    if (now - lastPriceFetchTime >= PRICE_CACHE_DURATION) {
      try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ripple&vs_currencies=usd');
        xrpPrice = response.data.ripple.usd;
        lastPriceFetchTime = now;
        console.log('Fetched XRP price from CoinGecko:', xrpPrice);
      } catch (coinGeckoError) {
        console.error('CoinGecko API error:', coinGeckoError.message);
        if (coinGeckoError.response && coinGeckoError.response.status === 429) {
          console.log('Rate limit exceeded, using fallback price:', xrpPrice);
        }
      }
    } else {
      console.log('Using cached XRP price:', xrpPrice);
    }
    const usdBalance = xrpBalance * xrpPrice;
    res.json({ xrpBalance: xrpBalance.toFixed(2), usdBalance: usdBalance.toFixed(2) });
  } catch (error) {
    console.error('Balance fetch error:', error.message);
    res.status(500).json({ xrpBalance: '0.00', usdBalance: '0.00' });
  }
});

wss.on('connection', (ws) => {
  console.log('Client connected to WebSocket');
  ws.on('close', () => console.log('Client disconnected from WebSocket'));
});

let lastUpdateTime = 0;
const MIN_UPDATE_INTERVAL = 300000; // 5 minutes
let lastPriceFetchTime = 0;
const PRICE_CACHE_DURATION = 900000; // 15 minutes

async function updateBalance() {
  const now = Date.now();
  if (now - lastUpdateTime < MIN_UPDATE_INTERVAL) {
    console.log('Skipping balance update, too soon since last update');
    return;
  }
  try {
    const accountInfo = await client.request({
      command: 'account_info',
      account: wallet.address,
      ledger_index: 'validated',
    });
    const xrpBalance = accountInfo.result.account_data.Balance / 1000000;
    console.log('Fetched XRP balance:', xrpBalance);
    let xrpPrice = 2.27; // Fallback price
    if (now - lastPriceFetchTime >= PRICE_CACHE_DURATION) {
      try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ripple&vs_currencies=usd');
        xrpPrice = response.data.ripple.usd;
        lastPriceFetchTime = now;
        console.log('Fetched XRP price from CoinGecko:', xrpPrice);
      } catch (coinGeckoError) {
        console.error('CoinGecko API error:', coinGeckoError.message);
        if (coinGeckoError.response && coinGeckoError.response.status === 429) {
          console.log('Rate limit exceeded, using fallback price:', xrpPrice);
        }
      }
    } else {
      console.log('Using cached XRP price:', xrpPrice);
    }
    const usdBalance = xrpBalance * xrpPrice;
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: 'balance', xrpBalance: xrpBalance.toFixed(2), usdBalance: usdBalance.toFixed(2) }));
      }
    });
    lastUpdateTime = now;
  } catch (error) {
    console.error('Balance update error:', error.message);
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: 'balance', xrpBalance: '0.00', usdBalance: '0.00' }));
      }
    });
  }
}

client.connect().then(() => {
  console.log('Connected to XRPL WebSocket');
  client.on('ledgerClosed', updateBalance);
  updateBalance(); // Initial fetch
}).catch(console.error);
