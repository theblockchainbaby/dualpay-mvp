const xrpl = require('xrpl');

async function checkBalance(address) {
  const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233');
  try {
    await client.connect();
    const seed = 'sEdVawtBsNiiRba4AA9Mhig99JgdQmr';
    console.log('Validating seed:', seed);
    const wallet = xrpl.Wallet.fromSeed(seed);
    console.log('Wallet validated:', wallet.address);
    const accountInfo = await client.request({
      command: 'account_info',
      account: address,
    });
    const balance = xrpl.dropsToXrp(accountInfo.result.account_data.Balance);
    console.log(`Balance for ${address}: ${balance} XRP`);
    return balance;
  } finally {
    await client.disconnect();
  }
}

if (require.main === module) {
  checkBalance('raVYEbj4zSwpJSz8XyrkfPENj7DEvhsw34');
}

module.exports = { checkBalance };
