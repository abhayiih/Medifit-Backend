const express = require("express");
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getCategories); 
router.post("/", protect, admin, createCategory); // only admin can create
router.put("/:id", protect, admin, updateCategory); // only admin can update
router.delete("/:id", protect, admin, deleteCategory); // only admin can delete


module.exports = router;
