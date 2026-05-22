const express = require('express');
const router = express.Router();
const {
    createPost,
    showPost,
    showSinglePost,
    deletePost,
    updatePost
} = require('../controllers/postController');

// Routes
router.post('/post/create', createPost);
router.get('/posts/show', showPost);
router.get('/post/:id', showSinglePost);
router.delete('/delete/post/:id', deletePost);
router.put('/update/post/:id', updatePost);

module.exports = router;
