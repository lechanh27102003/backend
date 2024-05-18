// applyPromotionScript.js
const mongoose = require('mongoose');
const Campaign = require('./models/Campaign');
const Product = require('./models/Product');

// Kết nối tới MongoDB
mongoose.connect('mongodb+srv://anhlc21411ca:123@plantiquecluster.yqxbee5.mongodb.net/?tls=true/plantiquedb', { useNewUrlParser: true, useUnifiedTopology: true });

async function applyPromotion() {
  try {
    const currentDate = new Date();
    // Lấy tất cả các chiến dịch đang trong thời gian áp dụng
    const campaigns = await Campaign.find({
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate },
      promotionType: 'samePrice'
    });

    for (const campaign of campaigns) {
      // Áp dụng chương trình khuyến mãi cho sản phẩm thuộc category tương ứng
      await Product.updateMany({ categoryId: campaign.productCategory }, { price: campaign.fixedPrice });
      console.log(`Applied promotion for campaign "${campaign.name}"`);
    }
    mongoose.connection.close(); // Đóng kết nối sau khi hoàn thành
  } catch (err) {
    console.error('Error applying promotion:', err);
  }
}

applyPromotion();
