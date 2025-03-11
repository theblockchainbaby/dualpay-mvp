const express = require('express');
const { sendTransaction } = require('./send.cjs');
const xrpl = require('xrpl');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/send', async (req, res) => {
  const { amount, recipient } = req.body;
  const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233');
  try {
    await client.connect();
    const wallet = xrpl.Wallet.fromSeed('sEdTRreFWphDdkDWFS9GKm6Ept2C76c'); // Updated seed
    const txHash = await sendTransaction(client, wallet, parseFloat(amount), 'XRP', recipient);
    res.json({ success: true, txHash });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  } finally {
    await client.disconnect();
  }
});

app.listen(3000, () => console.log('Server running at http://localhost:3000'));

