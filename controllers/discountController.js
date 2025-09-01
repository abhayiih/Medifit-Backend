const Product = require("../models/Product");
const Discount = require("../models/Discount"); 

// GET current discount
exports.getDiscount = async (req, res) => {
  try {
    let discount = await Discount.findOne(); // assuming only one discount document
    if (!discount) {
      discount = await Discount.create({ rate: 0}); 
    }
    res.json({ rate: discount.rate });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// SET discount
exports.setDiscount = async (req, res) => {
  try {
    const { rate } = req.body;
    if (rate < 0 || rate > 100) {
      return res.status(400).json({ message: "Discount must be between 0-100" });
    }

    // Update or create discount document
    let discount = await Discount.findOne();
    if (!discount) {
      discount = await Discount.create({ rate });
    } else {
      discount.rate = rate;
      await discount.save();
    }

    // Update all product prices based on originalPrice
    const products = await Product.find();
    for (const product of products) {
      product.price = Math.floor(product.originalPrice * (1 - rate / 100)); // round down
      await product.save();
    }

    res.json({ rate: discount.rate, message: "Discount applied to all products" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
