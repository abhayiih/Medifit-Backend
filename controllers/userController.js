const User = require("../models/User");

// Get all users (admin only)
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete user (admin only)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.deleteOne();
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Toggle block/unblock user (admin only)
const toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({
      message: `User ${user.isBlocked ? "blocked" : "unblocked"} successfully`,
      isBlocked: user.isBlocked,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const updateUser = async (req,res) =>{
    try {
    if (req.user.id !== req.params.id && !req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await user.save();
    const userData = updatedUser.toObject();
    delete userData.password;

    res.json(userData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}


module.exports = { getUsers, deleteUser, toggleBlockUser ,updateUser };
