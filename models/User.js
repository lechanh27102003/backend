const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, default: 'user' },
  password: { type: String, required: true },
  phoneNumber: { type: String },
  address: { type: String },
  profilePicture: { type: String }, 
});

const User = mongoose.model('User', userSchema);
module.exports = User;