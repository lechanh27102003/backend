const express = require('express');
const router = express.Router();
const campaignControllers = require('../controllers/campaignControllers');
const Campaign = require('../models/Campaign');
const Product = require('../models/Product');

// Create a new campaign
router.post('/', async (req, res) => {
  try {
    const campaign = await Campaign.create(req.body);
    res.status(201).json(campaign);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post('/apply-promotion', async (req, res) => {
    const { campaignId } = req.body;
    try {
      // Lấy thông tin của chiến dịch từ database
      const campaign = await Campaign.findById(campaignId);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
  
      // Kiểm tra xem có nằm trong khoảng thời gian của chiến dịch không
      const currentDate = new Date();
      if (currentDate >= campaign.startDate && currentDate <= campaign.endDate) {
        // Áp dụng chương trình khuyến mãi cho sản phẩm thuộc category tương ứng
        await Product.updateMany({ categoryId: campaign.productCategory }, { price: campaign.fixedPrice });
        res.status(200).json({ message: "Promotion applied successfully" });
      } else {
        // Ngoài khoảng thời gian, set giá sản phẩm về giá ban đầu
        await Product.updateMany({ categoryId: campaign.productCategory }, { price: '$originalPrice' });
        res.status(200).json({ message: "Promotion ended, prices reset" });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

// Route để lấy danh sách chiến dịch áp dụng cho sản phẩm
router.get('/applied', campaignControllers.getAllCampaignsForProduct);


// Route để áp dụng chiến dịch cho sản phẩm
router.put('/apply/:campaignId', campaignControllers.applyCampaignToProducts);


// GET all campaigns
router.get('/', async (req, res) => {
  try {
    const campaigns = await Campaign.find();
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET a campaign by ID
router.get('/:id', getCampaign, (req, res) => {
  res.json(res.campaign);
});

// PUT update a campaign
router.put('/:id', getCampaign, async (req, res) => {
  if (req.body.name != null) {
    res.campaign.name = req.body.name;
  }
  if (req.body.description != null) {
    res.campaign.description = req.body.description;
  }
  if (req.body.startDate != null) {
    res.campaign.startDate = req.body.startDate;
  }
  if (req.body.endDate != null) {
    res.campaign.endDate = req.body.endDate;
  }
  if (req.body.promotionType != null) {
    res.campaign.promotionType = req.body.promotionType;
  }
  if (req.body.fixedPrice != null) {
    res.campaign.fixedPrice = req.body.fixedPrice;
  }
  if (req.body.discountLevel != null) {
    res.campaign.discountLevel = req.body.discountLevel;
  }
  if (req.body.appliedObject != null) {
    res.campaign.appliedObject = req.body.appliedObject;
  }
  // Update other fields as needed
  try {
    const updatedCampaign = await res.campaign.save();
    res.json(updatedCampaign);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a campaign
router.delete('/:id', async (req, res) => {
  try {
    await Campaign.deleteOne({ _id: req.params.id });
    res.json({ message: 'Deleted Campaign' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

async function getCampaign(req, res, next) {
  let campaign;
  try {
    campaign = await Campaign.findById(req.params.id);
    if (campaign == null) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  res.campaign = campaign;
  next();
}


module.exports = router;