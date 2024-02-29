// authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require("dotenv").config();

const authenticate = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET);
    const user = await User.findById(decodedToken.userId);

    if (!user) {
      return res.status(401).json({ message: 'Invalid access token' });
    }

    req.user = user;
    next();

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({ message: 'Access token has expired' });
    } else {
      res.status(401).json({ message: 'Invalid access token' });
    }
  }
};

module.exports = authenticate;
