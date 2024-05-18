const express = require('express');
const authController = require('../controllers/authControllers');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);


router.post("/send-email",authController.sendEmail);
router.post("/reset-password", authController.resetPassword);
module.exports = router