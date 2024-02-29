const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    
    name: {
      type: String,
      required: [true, 'Please Input a Name'],
    },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);
module.exports = User;
