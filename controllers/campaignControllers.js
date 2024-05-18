
const Campaign = require('../models/Campaign');
const Product = require('../models/Product');

const getAllCampaignsForProduct = async (req, res) => {
  try {
    const campaigns = await Campaign.find({ appliedObject: "specificProduct" });
    res.status(200).json(campaigns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const applyCampaignToProducts = async (req, res) => {
  const campaignId = req.params.campaignId;
  const productIds = req.body.productIds;

  try {
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    const currentDateTime = new Date();
    for (const productId of productIds) {
      const product = await Product.findById(productId);
      if (!product) {
        console.warn(`Product with ID ${productId} not found. Skipping...`);
        continue; // Bỏ qua sản phẩm không tồn tại và chuyển sang sản phẩm tiếp theo
      }

      if (!product.previousPrice) {
        product.previousPrice = product.price; // Lưu giá gốc là giá hiện tại của sản phẩm
      }

      if (
        currentDateTime >= campaign.startDate &&
        currentDateTime <= campaign.endDate
      ) {
        // Áp dụng chiến dịch
        if (campaign.promotionType === 'samePrice') {
          product.price = campaign.fixedPrice;
          product.discount = 0;
        } else if (campaign.promotionType === 'productDiscount') {
          product.discount = campaign.discountLevel;
        }
      } else {
        // Chiến dịch đã kết thúc, set giá về giá ban đầu
        product.price = product.previousPrice;
        product.discount = 0;
      }

      await product.save();
      console.log(`Campaign applied to product ${productId}`);
    }

    res.status(200).json({ message: 'Campaign applied successfully' });
  } catch (error) {
    console.error('Error applying campaign:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getAllCampaignsForProduct,
  applyCampaignToProducts
};