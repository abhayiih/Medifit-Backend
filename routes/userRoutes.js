const express = require("express");
const { getUsers, deleteUser, toggleBlockUser } = require("../controllers/userController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// Only admin can fetch users
router.get("/", protect, admin, getUsers);

// Delete a user
router.delete("/:id", protect, admin, deleteUser);

// Block/Unblock a user
router.patch("/:id/block", protect, admin, toggleBlockUser);

module.exports = router;
