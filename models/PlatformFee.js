
const mongoose = require("mongoose");

const platformFeeSchema = new mongoose.Schema({
  rate: {
    type: Number, 
    required: true,
    default: 0,
  },
});

module.exports = mongoose.model("platformFee", platformFeeSchema);
