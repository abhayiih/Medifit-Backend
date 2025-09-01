// backend/controllers/cartController.js
const Cart = require("../models/Cart");
const Product = require("../models/Product");

//get or create cart
async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = await Cart.create({ userId, items: [] });
  }
  return cart;
}

// GET /api/cart
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate("items.productId");
    return res.json(cart || { userId: req.user.id, items: [] });
  } catch (e) {
    return res.status(500).json({ message: "Failed to load cart" });
  }
};

// POST /api/cart/add { productId, quantity }
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const qty = Math.max(1, Number(quantity) || 1);

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const cart = await getOrCreateCart(req.user.id);
    const idx = cart.items.findIndex((i) => i.productId.toString() === productId);

    if (idx >= 0) {
      cart.items[idx].quantity = qty;
    } else {
      cart.items.push({ productId, quantity: qty });
    }

    await cart.save();
    const populated = await cart.populate("items.productId");
    return res.json(populated);
  } catch (e) {
    return res.status(500).json({ message: "Failed to add to cart" });
  }
};

// PATCH /api/cart/item/:productId  { quantity }
exports.updateItemQty = async (req, res) => {
  try {
    const { quantity } = req.body;
    const qty = Math.max(1, Number(quantity) || 1);
    const { productId } = req.params;

    const cart = await getOrCreateCart(req.user.id);
    const idx = cart.items.findIndex((i) => i.productId.toString() === productId);
    if (idx === -1) return res.status(404).json({ message: "Item not found in cart" });

    cart.items[idx].quantity = qty;
    await cart.save();
    const populated = await cart.populate("items.productId");
    return res.json(populated);
  } catch (e) {
    return res.status(500).json({ message: "Failed to update item" });
  }
};

// DELETE /api/cart/item/:productId
exports.removeItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const cart = await getOrCreateCart(req.user.id);
    cart.items = cart.items.filter((i) => i.productId.toString() !== productId);
    await cart.save();
    const populated = await cart.populate("items.productId");
    return res.json(populated);
  } catch (e) {
    return res.status(500).json({ message: "Failed to remove item" });
  }
};

// DELETE /api/cart/clear
exports.clearCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user.id);
    cart.items = [];
    await cart.save();
    return res.json({ message: "Cart cleared" });
  } catch (e) {
    return res.status(500).json({ message: "Failed to clear cart" });
  }
};
