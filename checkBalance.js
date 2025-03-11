const xrpl = require('xrpl');

async function checkBalance(address) {
  const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233');
  try {
    await client.connect();
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
