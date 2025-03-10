const xrpl = require('xrpl'); // Single declaration

async function generateNewWallet() {
  const wallet = xrpl.Wallet.generate();
  console.log("Your new wallet:");
  console.log("Address:", wallet.address);
  console.log("Seed:", wallet.seed);
  return wallet;
}

generateNewWallet().catch(console.error);

