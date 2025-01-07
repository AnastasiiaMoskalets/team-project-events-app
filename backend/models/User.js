// backend/models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
    profileImage: { type: String, default: "/user-images/default.png" },
    bookedEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }] 

});

module.exports = mongoose.model("User", UserSchema);
