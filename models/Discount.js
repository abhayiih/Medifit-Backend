
const mongoose = require("mongoose");

const discountSchema = new mongoose.Schema({
  rate: {
    type: Number, 
    required: true,
    default: 0,
  },
});

module.exports = mongoose.model("Discount", discountSchema);
