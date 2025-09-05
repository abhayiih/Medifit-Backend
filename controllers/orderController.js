const Order = require("../models/Order");
const Cart = require("../models/Cart");
const sendMail = require("../utils/sendMail");

// Create order
exports.createOrder = async (req, res) => {
  try {
    const { shippingAddress, subtotal, gst, platformFee, platformFeePercent, totalAmount } = req.body;
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
      status: "Pending", //default order status
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


// Get orders (user or admin)
exports.getOrders = async (req, res) => {
  try {
    let orders;
    if (req.user.isAdmin){
      // Admin sees all orders with user info
      orders = await Order.find()
        .populate("items.productId")
        .populate("userId", "username email"); // Populate username and email
    } else {
      // Regular user sees only their orders
      orders = await Order.find({ userId: req.user.id }).populate("items.productId");
    }
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

//  Update order status (admin only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const order = await Order.findById(id).populate("userId", "email username");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    //Send email when delivered
    if (status === "Delivered") {
      await sendMail({
        to: order.userId.email,
        subject: "Order Delivered Successfully",
        text: `Hello ${order.userId.username || order.userId.email},\n\nYour order #${order._id} has been delivered successfully.\n\nThank you for shopping with us!`,
        html: `<p>Hello <strong>${order.userId.username || order.userId.email}</strong>,</p>
               <p>Your order <b>#${order._id}</b> has been <span style="color:green;"><b>delivered successfully</b></span>.</p>
               <p>Thank you for shopping with us!</p>`,
      });
    }

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update order status" });
  }
};
