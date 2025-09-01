const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getCart,
  addToCart,
  updateItemQty,
  removeItem,
  clearCart,
} = require("../controllers/cartController");

router.get("/", protect, getCart);
router.post("/add", protect, addToCart);
router.patch("/item/:productId", protect, updateItemQty);
router.delete("/item/:productId", protect, removeItem);
router.delete("/clear", protect, clearCart);


module.exports = router;
