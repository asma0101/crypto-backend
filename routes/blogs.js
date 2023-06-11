var express = require('express');
var router = express.Router();
var blogsController = require("../controllers/blogsController");

router.get('/', blogsController.getUserBlogs);
router.post('/create', blogsController.addBlog);
router.post('/update', blogsController.updateBlog);
router.post('/delete', blogsController.deleteBlog);

module.exports = router;
