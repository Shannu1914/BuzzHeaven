// backend/app.js
require("dotenv").config();
const path = require("path");
const express = require("express");
const http = require("http");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const multer = require("multer");

const connectDB = require("./config/db");
const User = require("./models/User");
const Post = require("./models/Post");
const Message = require("./models/Message");

// API Routes
const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const postsRoutes = require("./routes/posts");
const messagesRoutes = require("./routes/messages");
const mediaRoutes = require("./routes/media");
const adminRoutes = require("./routes/admin");

const app = express();
const server = http.createServer(app);

// ---------------- Socket.io ----------------
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
app.set("io", io);

// --------------- DB Connect ---------------
connectDB(process.env.MONGO_URI);

// --------------- Middlewares ---------------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "sessionsecret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
    }),
  })
);

// --------------- EJS + Static ---------------
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

// --------------- Auth middleware for pages ---------------
function ensureAuth(req, res, next) {
  if (!req.session.userId) return res.redirect("/login");
  next();
}

// attach current user to EJS global
app.use(async (req, res, next) => {
  res.locals.currentUser = null;
  if (req.session.userId) {
    res.locals.currentUser = await User.findById(req.session.userId).select("-passwordHash");
  }
  next();
});

// --------------- EJS Pages ---------------
app.get("/", async (req, res) => {
  const posts = await Post.find()
    .populate("author", "name avatarUrl")
    .sort({ createdAt: -1 })
    .limit(30);
  res.render("index", { title: "Home", posts });
});

app.get("/login", (req, res) => res.render("auth/login", { title: "Login", error: null }));
app.get("/register", (req, res) => res.render("auth/register", { title: "Register", error: null }));

app.get("/feed", ensureAuth, async (req, res) => {
  const posts = await Post.find()
    .populate("author", "name avatarUrl")
    .sort({ createdAt: -1 })
    .limit(50);
  res.render("home/feed", { title: "Feed", posts });
});

// Profile
app.get("/profile/:id", ensureAuth, async (req, res) => {
  const user = await User.findById(req.params.id).select("-passwordHash");
  const posts = await Post.find({ author: req.params.id }).sort({ createdAt: -1 });
  res.render("user/profile", { title: "Profile", user, posts });
});

// Create post page
app.get("/posts/create", ensureAuth, (_req, res) => res.render("posts/create", { title: "Create Post" }));

// Local upload system
const uploads = multer({ dest: "uploads/" });
app.post("/posts/create", ensureAuth, uploads.single("media"), async (req, res) => {
  await Post.create({
    author: req.session.userId,
    text: req.body.caption,
    mediaUrls: req.file ? ["/uploads/" + req.file.filename] : [],
  });
  res.redirect("/feed");
});
app.use("/uploads", express.static("uploads"));

// Chat
app.get("/messages", ensureAuth, (req, res) => {
  res.render("messages/chat", { title: "Messages" });
});

// Video call WebRTC
app.get("/call/:roomId", ensureAuth, (req, res) =>
  res.render("calls/video-call", { title: "Call", roomId: req.params.roomId })
);

// --------------- Admin ---------------
app.get("/admin/login", (_req, res) => res.render("admin/login", { title: "Admin", error: null }));
app.use("/admin", adminRoutes);

// --------------- API Routes ---------------
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/media", mediaRoutes);

// ---------------- Socket.IO realtime + WebRTC ----------------
io.on("connection", (socket) => {
  socket.on("register", (userId) => socket.join(userId));

  socket.on("message", async (data) => {
    const msg = await Message.create(data);
    const populated = await msg.populate("from", "name avatarUrl");
    io.to(data.to).emit("message", populated);
  });

  socket.on("call-offer", (d) => io.to(d.to).emit("call-offer", d));
  socket.on("call-answer", (d) => io.to(d.to).emit("call-answer", d));
  socket.on("ice-candidate", (d) => io.to(d.to).emit("ice-candidate", d));
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
