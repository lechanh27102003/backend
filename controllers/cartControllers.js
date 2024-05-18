

let items = []; // Dữ liệu giỏ hàng tạm thời

// Lấy danh sách sản phẩm trong giỏ hàng
exports.getItems = (req, res) => {
  res.json(items);
};

// Thêm sản phẩm vào giỏ hàng
exports.addToCart = (req, res) => {
  const { id, name, price, quantity } = req.body;
  const existingItem = items.find(item => item.id === id);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    items.push({ id, name, price, quantity });
  }

  res.status(200).send('Item added to cart successfully');
};

// Cập nhật số lượng sản phẩm trong giỏ hàng
exports.updateCart = (req, res) => {
  const { id, quantity } = req.params;
  const item = items.find(item => item.id === id);

  if (!item) {
    return res.status(404).send('Item not found in cart');
  }

  item.quantity = parseInt(quantity);

  res.status(200).send('Cart updated successfully');
};

// Xóa sản phẩm khỏi giỏ hàng
exports.removeFromCart = (req, res) => {
  const { id } = req.params;
  const index = items.findIndex(item => item.id === id);

  if (index === -1) {
    return res.status(404).send('Item not found in cart');
  }

  items.splice(index, 1);

  res.status(200).send('Item removed from cart successfully');
};
