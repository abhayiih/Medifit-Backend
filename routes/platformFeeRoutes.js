const express = require("express");
const router = express.Router();
const { getPlatformFee, setPlatformFee } = require("../controllers/platformFeeController.js");
const { protect, admin } = require("../middleware/authMiddleware.js");

// GET current platform fee
router.get("/", protect, getPlatformFee);

// UPDATE platform fee (admin only)
router.post("/", protect, admin, setPlatformFee);

module.exports = router;
