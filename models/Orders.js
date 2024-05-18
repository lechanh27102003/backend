const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productId: String,
    quantity: Number,
    price: Number,
    productImage: String,
    productName: String
});

const shipToSchema = new mongoose.Schema({
    fullName: String,
    city: String,
    district: String,
    address: String,
    email: String,
    phone: String,
    note: String,
    ward: String
});

const orderSchema = new mongoose.Schema({
    _id: String,
    userName: { type: String, required: true }, 
    products: [productSchema],
    shipTo: shipToSchema,
    shippingFee: Number,
    subTotal:Number,
    discountPrice:Number,
    totalPrice: Number,
    orderDate: {
        type: Date, 
        default: Date.now },
    paymentMethod: String,
    status: String,
    staffNote: String
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
