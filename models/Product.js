const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    chip: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
