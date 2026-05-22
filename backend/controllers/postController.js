const Post = require('../models/postModel');
const mongoose = require('mongoose');

// Create Post with Base64 Image
exports.createPost = async (req, res, next) => {
    try {
        const { title, content, image } = req.body;

        const post = await Post.create({
            title,
            content,
            image,
        });

        res.status(201).json({ success: true, post });
    } catch (error) {
        console.error("Error creating post:", error);
        next(error);
    }
};

// Get All Posts
exports.showPost = async (req, res, next) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, posts });
    } catch (error) {
        console.error("Error fetching posts:", error);
        next(error);
    }
};

// Get Single Post
exports.showSinglePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json({ success: true, post });
    } catch (error) {
        next(error);
    }
};

// Delete Post
exports.deletePost = async (req, res, next) => {
    try {
      const postId = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(400).json({ success: false, message: "Invalid post ID" });
      }
  
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ success: false, message: "Post not found" });
      }

      await Post.findByIdAndDelete(postId);
      res.status(200).json({ success: true, message: "Post deleted" });
    } catch (error) {
      console.error("Error deleting post:", error);
      next(error);
    }
};  
  

// Update Post
exports.updatePost = async (req, res, next) => {
    try {
        const { title, content, image } = req.body;
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ success: false, message: "Post not found" });

        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            { title: title || post.title, content: content || post.content, image: image || post.image },
            { new: true }
        );

        res.status(200).json({ success: true, updatedPost });
    } catch (error) {
        next(error);
    }
};
