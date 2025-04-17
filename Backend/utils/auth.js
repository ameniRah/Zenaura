const jwt = require('jsonwebtoken');
const config = require('../config/config');

const generateToken = (user) => {
  return jwt.sign(
    { 
      _id: user._id,
      role: user.role
    },
    config.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

module.exports = {
  generateToken
}; 