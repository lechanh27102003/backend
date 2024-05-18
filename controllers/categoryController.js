// controllers/categoryController.js
const Category = require('../models/Category');

exports.getCategories = async (req, res, next) => { // Ensure next parameter is included
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    next(error); // Pass error to next middleware
  }
};

exports.getCategoryById = async (req, res, next) => { // Ensure next parameter is included
  try {
    const category = await Category.find({categoryId : req.params.id});
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    next(error); // Pass error to next middleware
  }
};
