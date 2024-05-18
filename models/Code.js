// models/Code.js
const mongoose = require('mongoose');

const codeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  startDate: Date,
  endDate: Date,
  promotionType: { type: String, enum: ['discountByPercentage', 'discountByAmount'], required: true },
  discountAmount: Number,
  totalUses: Number,
  numOfUses: { type: Number, default: 0 }
});

const Code = mongoose.model('Code', codeSchema);

module.exports = Code;
