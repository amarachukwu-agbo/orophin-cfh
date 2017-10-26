const jwt = require('jsonwebtoken');

/**
 * An helper function to generate token
 * @param {object} data
 * @returns {string} token
 */
const generateToken = (data) => {
  const token = jwt.sign(
    { user: data },
    process.env.TOKEN_SECRET,
    { expiresIn: process.env.TOKEN_EXPIRY_TIME }
  );
  return token;
};
module.exports = generateToken;
