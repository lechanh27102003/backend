// productModel.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    status: { type: Number, required: true },
    stock: { type: Number, required: true },
    deleteDate: { type: Date, required: false },
    updateDate: { type: Date, required: false },
    categoryId: { type: String, required: true },
    image : { type: String, required: false },
    rating : { type: Number, required: true},
    discount : { type : Number, default: 0, required: false},
    previousPrice: { type: Number, required: false },
    
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
