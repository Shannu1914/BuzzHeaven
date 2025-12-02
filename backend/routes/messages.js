const express = require('express');
const Message = require('../models/Message');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, async (req, res) => {
  const { to, text } = req.body;
  const msg = new Message({ from: req.user._id, to, text });
  await msg.save();
  res.json(msg);
});

router.get('/conversation/:userId', auth, async (req, res) => {
  const other = req.params.userId;
  const msgs = await Message.find({
    $or: [{ from: req.user._id, to: other }, { from: other, to: req.user._id }]
  }).sort({ createdAt: 1 });
  res.json(msgs);
});

module.exports = router;
