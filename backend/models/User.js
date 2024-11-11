// backend/models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  profileImage: { type: String, default: "C:\Users\hp-pc\Source\Repos\team-project-events-app2\backend\default.png" }
});

module.exports = mongoose.model("User", UserSchema);
