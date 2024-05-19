const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  status: { 
    type: String, 
    default: 'Waiting' },  // Trạng thái mặc định khi tạo mới
  sentDate: { 
    type: Date, 
    default: Date.now },
  responseDate: { 
      type: Date, 
      default: null 
    }, // Trường ngày phản hồi mặc định là null
    responseMessage: {
        type: String
      }
  });
module.exports = mongoose.model('Contact', contactSchema);
