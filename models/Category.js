const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  categoryId: { type: Number, required: true },
  categoryName: { type: String, required: true },
  categoryImage: { type: String, required: true },
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;