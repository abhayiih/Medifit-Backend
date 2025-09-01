const Order = require("../models/Order");
const Cart = require("../models/Cart");

// Create order
exports.createOrder = async (req, res) => {
  try {
    const { shippingAddress, subtotal, gst, platformFee, platformFeePercent, totalAmount } = req.body; // ✅ include platformFeePercent
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const order = await Order.create({
      userId,
      items: cart.items,
      shippingAddress,
      subtotal,
      platformFee,
      platformFeePercent,
      gst,
      totalAmount,
      paymentStatus: "Success",
    });

    // Clear the cart after order is placed
    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create order" });
  }
};

// Get all orders of user
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate("items.productId");
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};
