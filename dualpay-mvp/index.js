const xrpl = require("xrpl");

async function generateAccounts() {
    const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233");
    await client.connect();

    // Generate wallets
    const senderWallet = xrpl.Wallet.generate();
    const issuerWallet = xrpl.Wallet.generate();
    const recipientWallet = xrpl.Wallet.generate();

    // Fund wallets with Testnet XRP
    console.log("Funding accounts...");
    const senderFunded = await client.fundWallet(senderWallet);
    const issuerFunded = await client.fundWallet(issuerWallet);
    const recipientFunded = await client.fundWallet(recipientWallet);

    // Output account details
    console.log("Sender Address:", senderWallet.address);
    console.log("Sender Seed:", senderWallet.seed);
    console.log("Issuer Address:", issuerWallet.address);
    console.log("Issuer Seed:", issuerWallet.seed);
    console.log("Recipient Address:", recipientWallet.address);
    console.log("Recipient Seed:", recipientWallet.seed);

    await client.disconnect();
}

generateAccounts().catch(console.error);

