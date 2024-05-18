const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categoryController');

router.get('/', categoriesController.getCategories); 
router.get('/:id', categoriesController.getCategoryById);

module.exports = router;
