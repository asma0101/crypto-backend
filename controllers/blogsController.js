const errors = require('../utilities/messages');
const axios = require('axios');
const Blog = require('../models/blog.model');

exports.getUserBlogs = (async (req, res) => {
    if (!req) {
        res.status(500).send( "Unable to process request");
    }
    const blogs = await Blog.find({userId: req.query.userId});
    if (blogs) {
        res.json({ success: true, data: blogs });
    }
    else {
        res.status(500).send({success: false, data: null, error: res?.error});
    }
})

exports.addBlog = (async (req, res) => {
     if (!req) {
        res.status(500).send( "Unable to process request");
    }
    try {
        let blog = new Blog({
            title: req.body.blog.title,
            subtitle: req.body.blog.subtitle,
            author: req.body.blog.author,
            userId: req.body.blog.userId,
        })
        const response = await blog.save();
        const updatedUserBlogs = await Blog.find({userId: req.body.blog.userId})
        res.json({
            success: true,
            updatedUserBlogs: updatedUserBlogs,
        });

    } catch (e) {
        res.status(500).send({ success: false, data: null, error: e });
    }

})
exports.updateBlog = (async (req, res) => {
     if (!req) {
        res.status(500).send( "Unable to process request");
    }
    try {
        let blog = await Blog.findOne({ _id: req.body.blog.id });
        console.log(blog)
        if (blog) {
             blog['title'] = req.body.blog.title;
            blog['author'] = req.body.blog.author;
            blog['subtitle'] = req.body.blog.subtitle;
            const response2 = await blog.save();
            const updatedUserBlogs = await Blog.find({userId: req.body.blog.userId})
            res.json({
                success: true,
                updatedUserBlogs: updatedUserBlogs,
            });
        }
    } catch (e) {
        res.status(500).send({ success: false, data: null, error: res?.error });
    }
})

exports.deleteBlog = (async (req, res) => {
     if (!req) {
        res.status(500).send( "Unable to process request");
    }
    try {
        await Blog.deleteOne({ _id: req.body.blog.id });
        const updatedUserBlogs = await Blog.find({userId: req.body.blog.userId})
        res.json({
            success: true,
            updatedUserBlogs: updatedUserBlogs,
        });
    } catch (e) {
        res.status(500).send({ success: false, data: null, error: res?.error });
    }

})