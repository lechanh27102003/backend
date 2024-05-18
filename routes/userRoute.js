const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');


router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.post('/:userId/upload-avatar', userController.uploadAvatar);

module.exports = router;
