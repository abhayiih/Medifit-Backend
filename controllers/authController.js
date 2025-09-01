const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sendMail = require("../utils/sendMail");

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "24h" });
};

// @desc   Register User
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save new user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Send welcome email
    await sendMail({
      to: email,
      subject: "Welcome to Medifit!",
      text: `Hello ${username}, welcome to Medifit!`,
      html: `
             <div style="font-family: Arial, sans-serif; text-align: center; color: #333;">
             <h1 style="color: #1976d2;">Welcome to Medifit, ${username}!</h1>
             <p>Thank you for registering with Medifit. We're thrilled to have you on board!</p>
             <p>Get ready to explore our products, stay healthy, and enjoy a seamless shopping experience.</p>
             <p style="margin-top: 20px; font-size: 14px; color: #555;">
            — The Medifit Team
             </p>
             </div>
            `,
    });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      isBlocked: user.isBlocked,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc   Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if user is blocked
    if (user.isBlocked) {
      return res.status(403).json({ message: "Your account has been disabled. Please contact support." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      isBlocked: user.isBlocked,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = crypto.randomBytes(20).toString("hex");
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();

    await sendMail({
      to: email,
      subject: "Password Reset",
      html: `<p>Hello ${user.username}, click the link to reset your password:</p>
             <a href="http://localhost:5173/reset-password/${token}">Reset Password</a>`,
    });

    res.json({ message: "Password reset email sent" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc   Reset Password
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { registerUser, loginUser, forgotPassword, resetPassword };
