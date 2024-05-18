const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartControllers');


// Lấy danh sách sản phẩm trong giỏ hàng
router.get('/', cartController.getItems);

// Thêm sản phẩm vào giỏ hàng
router.post('/add', cartController.addToCart);

// Cập nhật số lượng sản phẩm trong giỏ hàng
router.put('/update/:id/:quantity', cartController.updateCart);

// Xóa sản phẩm khỏi giỏ hàng
router.delete('/remove/:id', cartController.removeFromCart);

module.exports = router;
