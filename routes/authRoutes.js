const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const router = express.Router();
require("dotenv").config();

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { email, password, name, phoneNumber, image } = req.body;
    if (!email || !password || !name || !phoneNumber || !image) {
      return res.status(400).json({ message: "Fields are required" });
    }

    // Check if there's an existing User
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash the password before saving to the Database
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password: hashedPassword,
      name,
      phoneNumber,
      image,
    });
    await user.save();

    // Generate a token for the new User
    const token = jwt.sign(
      { email: user.email, userId: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "5h",
      }
    );

    res
      .status(201)
      .json({ message: "User created successfully", token, userId: user._id });
    console.log(`User Created Successfully`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//logIn
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    //Find the user with the email in the datebase

    const user = await User.findOne({ email });

    //check if user exists
    if (!user) {
      res.status(401).json({ message: "Invalid Email or Password" });
    }

    //compare the password provided with the hashed one in the Db

    const PasswordMatch = await bcrypt.compare(
      String(password),
      String(user.password)
    );
    if (!PasswordMatch) {
      return res.status(401).json({ message: "Invalid Email or Password" });
    }

    // Generate an access token for the authenticated User
    const accessToken = jwt.sign(
      { email: user.email, userId: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "5h",
      }
    );

    // Generate a refresh token and store it in the database
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_SECRET,
      {
        expiresIn: "7d", // You can set the expiration time for refresh tokens as needed
      }
    );
    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
      userId: user._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
// Refresh token route
router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token is required' });
  }

  try {
    // Verify the refresh token
    const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    const user = await User.findById(decodedToken.userId);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    // Generate a new access token
    const newAccessToken = jwt.sign({ email: user.email, userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '5h',
    });

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Invalid refresh token' });
  }
});

module.exports = router;

module.exports = router;
