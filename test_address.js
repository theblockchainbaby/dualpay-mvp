const xrpl = require('xrpl');

function isValidAddress(address) {
  try {
    xrpl.decodeAddress(address);
    return true;
  } catch {
    return false;
  }
}

const address = "r3EQkqKicAtDnfXHAj79XahVMwJFTMWsDF";
console.log("Address:", address);
console.log("Is valid?", isValidAddress(address));
console.log("Characters:", [...address].join(", "));

