const hardcodedPasscode = '1234'; // Replace with secure storage in production

function verifyPasscode(passcode) {
  return passcode === hardcodedPasscode;
}

module.exports = { verifyPasscode };
