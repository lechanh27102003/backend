// productRoutes.js
const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productController');

router.get('/getall/:id', productsController.getProducts);
router.get('/:id', productsController.getProductById);
router.post('/addnew', productsController.addProduct);
router.get('/getbystatus/:id', productsController.getProductsByStatus);
router.put('/uploadProduct/:id', productsController.uploadProduct);
router.post('/feedback', productsController.feedback);
router.get('/getAllFeedbackById/:id', productsController.getAllFeedbackById);
router.put('updateRating/:id', productsController.updateRating);
router.delete('/deleteProduct/:id', productsController.deleteProduct);
router.get('/relatedProduct/:id', productsController.getRealtedProducts);
router.get('/search/:id', productsController.searchProducts);



module.exports = router;
