// authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/user');
const axios = require('axios');  // Import axios if not already imported
require('dotenv').config();

const authenticate = async (req, res, next) => {
  const accessToken = req.header('Authorization');

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
      // Token has expired, attempt to refresh it
      try {
        const refreshToken = req.user.refreshToken; // Fetch the refresh token from req.user
        const response = await axios.post('http://localhost:3001/auth/refresh', { refreshToken });
        const newAccessToken = response.data.accessToken;
        req.user = response.data.user; // Update req.user with the refreshed token and user data if needed
        req.headers.authorization = `Bearer ${newAccessToken}`; // Update the request header with the new access token
        next();
      } catch (refreshError) {
        res.status(401).json({ message: 'Invalid access token and unable to refresh' });
      }
    } else {
      res.status(401).json({ message: 'Invalid access token' });
    }
  }
};

module.exports = authenticate;
