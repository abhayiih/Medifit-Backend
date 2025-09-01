
const express = require("express");
const router = express.Router();
const discountController = require("../controllers/discountController");
const {protect, admin} =require('../middleware/authMiddleware')

// Get current discount
router.get("/discount", protect,  discountController.getDiscount);

// Set discount (admin only)
router.post("/discount", protect, admin, discountController.setDiscount);

module.exports = router;
