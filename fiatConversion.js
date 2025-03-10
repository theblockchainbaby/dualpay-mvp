const axios = require('axios');

async function getXrpToFlatRate(fiatCurrency = 'usd') {
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

module.exports = { getXrpToFlatRate };

