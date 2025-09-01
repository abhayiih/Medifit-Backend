const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { createOrder, getOrders } = require("../controllers/orderController");

const router = express.Router();

router.post("/", protect, createOrder);   // Place new order
router.get("/", protect, getOrders);      // Get all user orders

module.exports = router;
