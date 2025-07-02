const xrpl = require('xrpl');

const seed = 'sEdVawtBsNiiRba4AA9Mhig99JgdQmr';
try {
  const wallet = xrpl.Wallet.fromSeed(seed);
  console.log('Wallet generated successfully:');
  console.log('Address:', wallet.address);
  console.log('Seed:', wallet.seed);
} catch (error) {
  console.error('Error:', error.message);
}
