const xrpl = require("xrpl"); // Single declaration
const axios = require('axios');

const config = {
  testnetUrl: "wss://s.altnet.rippletest.net:51233",
  transactions: [
    {
      amount: "1",
      currency: "XRP",
      recipient: "rLqoPNccpG4zEJX99cfoXZbHJGWWB8Q2VP",
    },
    {
      amount: "0.5",
      currency: "XRP",
      recipient: "rD5KjjeN62Y9AqawhXnUGRhuWaumJQfmWe",
    },
  ],
  senderSeed: "sEdSV3bu5LAEcB79mqQXMu43sZ4R6yW", // Replace with new seed from generateWallet.js
};

async function getXrpToFiatRate(fiatCurrency = 'usd') {
  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=ripple&vs_currencies=${fiatCurrency}`
    );
    return response.data.ripple[fiatCurrency];
  } catch (error) {
    console.error("Error fetching conversion rate:", error.message);
    throw error;
  }
}

function xrpToDrops(amount) {
  return xrpl.xrpToDrops(amount);
}

function isValidAddress(address) {
  try {
    const encoded = xrpl.encodeAccountID(xrpl.decodeAccountID(address));
    return encoded === address;
  } catch (e) {
    console.warn("Address validation failed:", address, "Error:", e.message);
    return false;
  }
}

async function sendTransaction(client, wallet, amount, currency, recipient) {
  try {
    console.log("Validating recipient address:", recipient);
    if (!isValidAddress(recipient)) throw new Error("Invalid recipient address");
    const accountInfo = await client.request({
      command: "account_info",
      account: wallet.address,
      ledger_index: "current",
    });
    const balance = Number(accountInfo.result.account_data.Balance) / 1000000;
    const totalAmount = Number(amount) + 0.00001;
    if (balance < totalAmount) throw new Error(`Insufficient funds: ${balance} XRP`);

    let prepared;
    if (currency === "XRP") {
      prepared = await client.autofill({
        TransactionType: "Payment",
        Account: wallet.address,
        Amount: xrpToDrops(amount),
        Destination: recipient,
      });
      console.log("Prepared transaction:", JSON.stringify(prepared, null, 2));

      const rate = await getXrpToFiatRate('usd');
      const fiatAmount = Number(amount) * rate;
      console.log(`${amount} XRP = ${fiatAmount.toFixed(2)} USD`);
    } else {
      prepared = await client.autofill({
        TransactionType: "Payment",
        Account: wallet.address,
        Amount: { currency, value: amount, issuer: "rSomeIssuerAddress" },
        Destination: recipient,
      });
      console.warn("Stablecoin/fiat simulation; issuer support may vary");
    }

    const signed = wallet.sign(prepared);
    const result = await client.submitAndWait(signed.tx_blob);

    console.log(`Transaction for ${amount} ${currency} to ${recipient}:`, result.result.meta.TransactionResult);
    console.log("Explorer link:", `https://testnet.xrpl.org/transactions/${result.result.hash}`);
    return result.result.hash;
  } catch (error) {
    console.error(`Error for ${amount} ${currency} to ${recipient}:`, error.message);
    throw error;
  }
}

async function main() {
  let client;
  try {
    client = new xrpl.Client(config.testnetUrl);
    await client.connect();
    console.log("Connected to Testnet");

    const wallet = xrpl.Wallet.fromSeed(config.senderSeed);
    console.log("Raw Seed:", config.senderSeed);
    console.log("Sender address:", wallet.address);

    for (const tx of config.transactions) {
      await sendTransaction(client, wallet, tx.amount, tx.currency, tx.recipient);
    }
  } catch (error) {
    console.error("Main error:", error.message);
  } finally {
    if (client) await client.disconnect();
    console.log("Disconnected from Testnet");
  }
}

main();

module.exports = { sendTransaction, xrpToDrops, isValidAddress };

