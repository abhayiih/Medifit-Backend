const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    resetToken: String,
    resetTokenExpiry: Date,
    isAdmin: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false }, // 🔴 new field
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
