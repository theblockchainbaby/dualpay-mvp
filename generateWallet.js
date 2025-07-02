const xrpl = require('xrpl');

function generateNewWallet() {
  const wallet = xrpl.Wallet.generate();
  console.log('Your new wallet:');
  console.log('Address:', wallet.address);
  console.log('Seed:', wallet.seed);
  return wallet;
}

if (require.main === module) {
  generateNewWallet();
}

module.exports = { generateNewWallet };

