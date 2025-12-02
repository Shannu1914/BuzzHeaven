const express = require('express');
const User = require('../models/User');
const router = express.Router();

router.get('/me', async (req, res) => {
  // get user by session for views or JWT for API
  if (req.session && req.session.userId) {
    const u = await User.findById(req.session.userId).select('-passwordHash');
    return res.json(u);
  }
  res.status(401).json({ error: 'Not logged in' });
});

router.get('/:id', async (req, res) => {
  const u = await User.findById(req.params.id).select('-passwordHash');
  if (!u) return res.status(404).json({ error: 'Not found' });
  res.json(u);
});

module.exports = router;
