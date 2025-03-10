const xrpl = require("xrpl");

async function sendXRP() {
    const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233");
    await client.connect();

    // Replace these values with the ones from your index.js output
    const senderWallet = xrpl.Wallet.fromSeed("sEd7RU7jLk64e6wJb5dRXdw4L4eiU");
    const recipientAddress = "rUHX8NDTJ5RzHcy4nmoM6hschtv3cYQe7B";

    const payment = {
        TransactionType: "Payment",
        Account: senderWallet.address,
        Amount: xrpl.xrpToDrops("25"), // Sends 25 XRP
        Destination: recipientAddress,
    };

    const prepared = await client.autofill(payment);
    const signed = senderWallet.sign(prepared);
    const result = await client.submitAndWait(signed.tx_blob);

    console.log("Transaction result:", result.result.meta.TransactionResult);
    console.log("Explorer Link: https://testnet.xrpl.org/transactions/" + signed.hash);

    await client.disconnect();
}

sendXRP().catch(console.error);
