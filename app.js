const express = require("express");
const app = express();

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const menuRoutes = require('./routes/menuRoutes');


app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/menu', menuRoutes);

module.exports = app;