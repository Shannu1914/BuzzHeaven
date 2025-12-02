require('dotenv').config();
const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');
const initAWS = require('./config/aws');

// connect DB
connectDB(process.env.MONGO_URI).then(()=> console.log('MongoDB connected')).catch(err => console.error(err));
initAWS();

// create server + socket
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, { cors: { origin: process.env.FRONTEND_ORIGIN || '*' } });
app.set('io', io);

// load socket handlers
require('./socket')(io);

// View routes (pages) — simple ones here (for EJS pages)
app.get('/', async (req, res) => {
  res.render('index', { title: 'Welcome' });
});

// Admin login GET/POST (session)
app.get('/admin/login', (req, res) => res.render('admin/login', { title: 'Admin Login', error: null }));
app.post('/admin/login', (req, res) => {
  const { email, password } = req.body;
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    req.session.admin = true;
    return res.redirect('/admin/dashboard');
  }
  return res.render('admin/login', { title: 'Admin Login', error: 'Invalid credentials' });
});

// EJS page routes (auth/register/login pages, feed, profile, posts/create)
app.get('/login', (req, res) => res.render('auth/login', { title: 'Login', error: null }));
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const User = require('./models/User');
  const user = await User.findOne({ email });
  if (!user) return res.render('auth/login', { title: 'Login', error: 'Invalid credentials' });
  const ok = await user.checkPassword(password);
  if (!ok) return res.render('auth/login', { title: 'Login', error: 'Invalid credentials' });
  req.session.userId = user._id;
  res.redirect('/feed');
});
app.get('/register', (req, res) => res.render('auth/register', { title: 'Register', error: null }));
app.post('/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  const User = require('./models/User');
  if (await User.findOne({ email })) return res.render('auth/register', { title: 'Register', error: 'Email exists' });
  const user = new User({ name, email });
  await user.setPassword(password);
  await user.save();
  req.session.userId = user._id;
  res.redirect('/feed');
});

// feed
app.get('/feed', async (req, res) => {
  const Post = require('./models/Post');
  const posts = await Post.find().populate('author', 'name avatarUrl').sort({ createdAt: -1 }).limit(50);
  res.render('feed/feed', { title: 'Feed', posts });
});

// create post (local upload)
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });
app.get('/posts/create', (req, res) => res.render('posts/create', { title: 'Create Post' }));
app.post('/posts/create', upload.single('media'), async (req, res) => {
  const Post = require('./models/Post');
  const userId = req.session.userId;
  if (!userId) return res.redirect('/login');
  const mediaUrl = req.file ? `/uploads/${req.file.filename}` : null;
  const post = new Post({ author: userId, text: req.body.caption, mediaUrls: mediaUrl ? [mediaUrl] : [] });
  await post.save();
  res.redirect('/feed');
});

// profile
app.get('/profile/:id', async (req, res) => {
  const User = require('./models/User');
  const Post = require('./models/Post');
  const user = await User.findById(req.params.id);
  const posts = await Post.find({ author: user._id }).sort({ createdAt: -1 });
  res.render('profile/profile', { title: `${user.name} - Profile`, user, posts });
});

// messages page
app.get('/messages', (req, res) => res.render('messages/chat', { title: 'Messages' }));

// call page: room optional
app.get('/call/:roomId?', (req, res) => {
  const roomId = req.params.roomId || `room-${Date.now()}`;
  res.render('call/video-call', { title: 'Call', roomId });
});

// static uploads
const express = require('express');
app.use('/uploads', express.static('uploads'));

// start server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on ${PORT}`));
