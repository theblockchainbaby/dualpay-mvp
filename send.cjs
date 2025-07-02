const xrpl = require('xrpl');
const { convertXrpToFiat } = require('./fiatConversion');
const { checkBalance } = require('./checkBalance');

const config = {
  testnetUrl: 'wss://s.altnet.rippletest.net:51233',
  senderSeed: 'sEdVawtBsNiiRba4AA9Mhig99JgdQmr',
  transactions: [
    { amount: 1, currency: 'XRP', recipient: 'rLqoPNccpG4zEJX99cfoXZbHJGWWB8Q2VP' },
    { amount: 0.5, currency: 'XRP', recipient: 'rD5KjjeN62Y9AqawhXnUGRhuWaumJQfmWe' }
  ]
};

async function sendTransaction(client, wallet, amount, currency, recipient) {
  if (currency !== 'XRP') throw new Error('Only XRP supported');
  const balance = await checkBalance(wallet.address);
  if (balance < amount + 0.000012) {
    throw new Error(`Insufficient funds: ${balance} XRP`);
  }

  const prepared = await client.autofill({
    TransactionType: 'Payment',
    Account: wallet.address,
    Amount: xrpl.xrpToDrops(amount),
    Destination: recipient,
  });

  console.log('Prepared:', JSON.stringify(prepared, null, 2));
  const usdAmount = await convertXrpToFiat(amount);
  console.log(`${amount} XRP = ${usdAmount.toFixed(2)} USD`);

  const signed = wallet.sign(prepared);
  const result = await client.submitAndWait(signed.tx_blob);

  console.log(`Result for ${amount} XRP to ${recipient}:`, result.result.meta.TransactionResult);
  console.log('Explorer:', `https://testnet.xrpl.org/transactions/${result.result.hash}`);
  return result.result.hash;
}

async function main() {
  let client;
  try {
    client = new xrpl.Client(config.testnetUrl);
    await client.connect();
    console.log('Connected to Testnet');

    const wallet = xrpl.Wallet.fromSeed(config.senderSeed);
    console.log('Sender:', wallet.address);

    for (const tx of config.transactions) {
      await sendTransaction(client, wallet, tx.amount, tx.currency, tx.recipient);
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    if (client) await client.disconnect();
    console.log('Disconnected');
  }
}

if (require.main === module) {
  main();
}

module.exports = { sendTransaction };
