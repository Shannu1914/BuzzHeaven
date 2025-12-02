const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  avatarUrl: { type: String, default: null },
  bio: { type: String, default: '' },
  isBanned: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

UserSchema.methods.setPassword = async function (pw) {
  this.passwordHash = await bcrypt.hash(pw, 12);
};
UserSchema.methods.checkPassword = function (pw) {
  return bcrypt.compare(pw, this.passwordHash);
};

module.exports = mongoose.model('User', UserSchema);
