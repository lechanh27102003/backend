const mongoose = require('mongoose');
// controllers/blogController.js

const Blog = require('../models/Blog');

// POST handler to create a new blog
exports.createBlog = async (req, res) => {
    try {
        const { title, createDate, content, image, author } = req.body;
        const newBlog = new Blog({ title, createDate, content,image, author});
        await newBlog.save();
        res.status(201).json(newBlog);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
// GET handler to fetch all blogs
exports.getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).send({ message: 'Blog not found' });
        }
        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateBlog = async (req, res) => {
    try {
        const { title, content, image } = req.body;
        const blogId = req.params.id;
        const updatedBlog = await Blog.findByIdAndUpdate(blogId, { title, content, image }, { new: true });
        res.status(200).json(updatedBlog);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
// DELETE handler to delete a blog
exports.deleteBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        await Blog.findByIdAndDelete(blogId);
        res.status(200).json({ message: "Blog deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


