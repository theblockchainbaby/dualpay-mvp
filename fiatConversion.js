const axios = require('axios');

async function getXrpToFiatRate(fiatCurrency = 'usd') {
  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=ripple&vs_currencies=${fiatCurrency}`
    );
    return response.data.ripple[fiatCurrency];
  } catch (error) {
    console.error('Error fetching rate:', error.message);
    throw error;
  }
}

async function convertXrpToFiat(xrpAmount, fiatCurrency = 'usd') {
  const rate = await getXrpToFiatRate(fiatCurrency);
  return xrpAmount * rate;
}

module.exports = { getXrpToFiatRate, convertXrpToFiat };

