const express = require("express");
const { protect, admin } = require("../middleware/authMiddleware");
const { createOrder, getOrders, updateOrderStatus } = require("../controllers/orderController");

const router = express.Router();

router.post("/", protect, createOrder);    // Place new order
router.get("/", protect, getOrders);       // Get all user orders
router.put("/:id/status", protect, admin, updateOrderStatus); //Update order status (admin only)

module.exports = router;
