const express = require('express');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectDB = require('./config/db');
const initAWS = require('./config/aws');

const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const postsRoutes = require('./routes/posts');
const messagesRoutes = require('./routes/messages');
const mediaRoutes = require('./routes/media');
const adminRoutes = require('./routes/admin');

const User = require('./models/User');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// session
app.use(session({
  secret: process.env.SESSION_SECRET || 'sessionsecret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
}));

// expose current user to views
app.use(async (req, res, next) => {
  res.locals.currentUser = null;
  if (req.session && req.session.userId) {
    const u = await User.findById(req.session.userId).select('-passwordHash');
    res.locals.currentUser = u;
  }
  next();
});

// API routers
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/media', mediaRoutes);

// Admin routes (admin login handling is in server.js to allow session)
app.use('/admin', adminRoutes);

module.exports = app;
