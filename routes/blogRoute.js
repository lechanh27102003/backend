// blogRoute.js
const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');

router.post('/', blogController.createBlog);
router.get('/', blogController.getBlogs);
router.delete('/:id', blogController.deleteBlog);
router.put('/:id', blogController.updateBlog);
router.get('/:id', blogController.getBlogById);

module.exports = router;
