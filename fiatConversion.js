const axios = require('axios');

async function convertXrpToFiat(amount) {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ripple&vs_currencies=usd');
    const rate = response.data.ripple.usd;
    return amount * rate;
  } catch (error) {
    console.error('Fiat conversion error:', error.message);
    return amount * 0.80; // Fallback rate
  }
}

module.exports = { convertXrpToFiat };
