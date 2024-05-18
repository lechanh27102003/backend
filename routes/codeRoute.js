// routes/codeRoutes.js
const express = require('express');
const router = express.Router();
const Code = require('../models/Code');

// Route để lấy danh sách các mã code
router.get('/', async (req, res) => {
  try {
    const codes = await Code.find();
    res.json(codes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route để tạo và lưu mã code mới
router.post('/', async (req, res) => {
  try {
    const newCode = await Code.create(req.body);
    res.status(201).json(newCode);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
router.delete('/:id', async (req, res) => {
    try {
      const codeId = req.params.id;
      // Thực hiện xóa mã code từ MongoDB
      await Code.findByIdAndDelete(codeId);
      res.json({ message: 'Code deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // Route để cập nhật mã code
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const updatedFields = req.body;

  try {
    const updatedCode = await Code.findByIdAndUpdate(id, updatedFields, { new: true });
    res.json(updatedCode);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

  router.post('/apply', async (req, res) => {
    const { code, orderTotal } = req.body;
    try {
        // Find discount code in MongoDB
        const discountCode = await Code.findOne({ name: code});

        if (!discountCode) {
            return res.status(404).json({ valid: false, message: 'Discount code not found' });
        }

        // Check if discount code is valid
        const currentDate = new Date();
        if (currentDate < discountCode.startDate || currentDate > discountCode.endDate) {
            return res.status(400).json({ valid: false, message: 'Discount code expired' });
        }

        if (discountCode.numOfUses >= discountCode.totalUses) {
            return res.status(400).json({ valid: false, message: 'Discount code has reached maximum uses' });
        }

        // Apply discount code
        let discountedTotal = orderTotal;
        if (discountCode.promotionType === 'discountByPercentage') {
            discountedTotal *= discountCode.discountAmount / 100;
        } else if (discountCode.promotionType === 'discountByAmount') {
            discountedTotal = discountCode.discountAmount;
        }

        // Update discount code usage
        discountCode.numOfUses++;
        await discountCode.save();

        return res.status(200).json({ valid: true, description: discountCode.description, discountedTotal });
    } catch (error) {
        console.error('Error applying discount code:', error);
        return res.status(500).json({ valid: false, message: 'Internal server error' });
    }
});

module.exports = router;
