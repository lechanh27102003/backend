const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// Contact routes
router.post('/', contactController.createContact);
router.get('/', contactController.getAllContacts);
router.get('/:id', contactController.getContactById);
// PUT route to update a contact
router.put('/:id', contactController.updateContact);


module.exports = router;
