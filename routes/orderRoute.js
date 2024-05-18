const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.get('/orders', orderController.getOrders);
router.get('/orders/:id', orderController.getOrderById);
router.put('/orders/:id', orderController.updateOrder);
router.get('/orders/search', orderController.searchOrders);
router.post('/orders', orderController.createOrder);
router.get('/orders/username/:username', orderController.getOrdersByUsername);

module.exports = router;
