const express = require('express');
const User = require('../models/User');
const Post = require('../models/Post');
const adminAuth = require('../middleware/adminAuth');
const router = express.Router();

// admin dashboard index (protected)
router.get('/dashboard', adminAuth, async (req, res) => {
  const userCount = await User.countDocuments();
  const postCount = await Post.countDocuments();
  res.render('admin/dashboard', { title: 'Admin Dashboard', userCount, postCount });
});

router.get('/users', adminAuth, async (req, res) => {
  const users = await User.find().limit(200);
  res.render('admin/users', { title: 'Manage Users', users });
});

router.get('/users/ban/:id', adminAuth, async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { isBanned: true });
  res.redirect('/admin/users');
});

router.get('/users/unban/:id', adminAuth, async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { isBanned: false });
  res.redirect('/admin/users');
});

router.get('/posts', adminAuth, async (req, res) => {
  const posts = await Post.find().populate('author', 'name').sort({ createdAt: -1 }).limit(200);
  res.render('admin/posts', { title: 'Manage Posts', posts });
});

router.get('/posts/delete/:id', adminAuth, async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.redirect('/admin/posts');
});

router.get('/calls', adminAuth, async (req, res) => {
  const calls = await CallLog.find().populate('caller receiver');
  res.render('call/calls', { calls });
});

router.get('/reports', adminAuth, async (req, res) => {
  const reports = await Report.find().populate('user');
  res.render('admin/reports', { reports });
});
// admin login page and handler (mounted separately by server because it needs session)
module.exports = router;
