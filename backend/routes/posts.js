const express = require('express');
const Post = require('../models/Post');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, async (req, res) => {
  const { text, mediaUrls, mediaType } = req.body;
  const post = new Post({ author: req.user._id, text, mediaUrls, mediaType });
  await post.save();
  res.json(post);
});

router.get('/', async (req, res) => {
  const posts = await Post.find().populate('author', 'name avatarUrl').sort({ createdAt: -1 }).limit(50);
  res.json(posts);
});

router.post('/:id/like', auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ error: 'Not found' });
  const idStr = String(req.user._id);
  if (!post.likes.some(l => String(l) === idStr)) post.likes.push(req.user._id);
  else post.likes = post.likes.filter(l => String(l) !== idStr);
  await post.save();
  res.json(post);
});

module.exports = router;
