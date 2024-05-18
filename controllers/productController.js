// controllers/categoryController.js
const Product = require('../models/Product');
const Category = require('../models/Category');
const Feedback = require('../models/Feedback');
const { search } = require('../routes/product');
exports.getProducts = async (req, res, next) => {
  try {
    let products;
    const categoryId = req.params.id;

    if (categoryId && categoryId !== '0') {
      products = await Product.find({ categoryId: categoryId, status: 2 });
    } else {
      products = await Product.find({ status: 2 });
    }

    res.json(products);
  } catch (error) {
    next(error);
  }
};


exports.getProductsByStatus = async (req, res, next) => {
  try {
    let products;
    if (req.params.id && req.params.id !== '0') {
      products = await Product.find({ status: req.params.id });
    } else {
      products = await Product.find();
    }
    res.json(products);
  } catch (error) {
    next(error);
  }
};


exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
};

exports.addProduct = async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.uploadProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

exports.feedback = async (req, res) => {
  try {
    const newFeedback = await Feedback.create(req.body);
    res.status(201).json(newFeedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
exports.getAllFeedbackById = async (req, res, next) => {
  try {
    let feedback;
    feedback = await Feedback.find({ productID: req.params.id });
    res.json(feedback);
  } catch (error) {
    next(error);
  }
}


exports.updateRating = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.searchProducts = async (req, res, next) => {
  try {
    const searchContent = req.params.id;
    if(searchContent == null) {
      
    }
    const searchResults = await Product.find({
      productName: { $regex: searchContent, $options: 'i' }, 
      status : 2
    });

    res.json(searchResults);
  } catch (error) {
    console.error("Error searching products", error);
    next(error);
  }
};

exports.getRealtedProducts = async (req, res, next) => {
  try {
    let products;
    const categoryId = req.params.id;

    if (categoryId && categoryId !== '0') {
      // Sử dụng limit(4) để chỉ lấy 4 sản phẩm
      products = await Product.find({ categoryId: categoryId, status: 2 }).limit(4);
    } 

    res.json(products);
  } catch (error) {
    next(error);
  }
};
