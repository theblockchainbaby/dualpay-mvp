const { Wallet } = require('xrpl');
const wallet = Wallet.fromSeed("sEdSCHmGjDD1TzntANQ3muxzp5QBAwP");
console.log("Address:", wallet.address);
