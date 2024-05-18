const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  name: String,
  description: String,
  startDate: Date,
  endDate: Date,
  promotionType: String,
  fixedPrice: Number,
  discountLevel: Number,
  appliedObject: String,
  productCategory: Number,
});

const Campaign = mongoose.model('Campaign', campaignSchema);

module.exports = Campaign;