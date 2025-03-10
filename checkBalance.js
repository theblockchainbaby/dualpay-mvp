const xrpl = require("xrpl");

async function checkBalance() {
  const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233");
  await client.connect();

  const response = await client.request({
    command: "account_info",
    account: "rMMs9ysx4DLWLVTXAVUCTfbAMvf6NhqXaC",
    ledger_index: "validated",
  });

  console.log("✅ Wallet Balance:", response.result.account_data.Balance, "drops"); 
  console.log("1 XRP = 1,000,000 drops");

  await client.disconnect();
}

checkBalance();

