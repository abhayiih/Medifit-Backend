const PlatformFee = require("../models/PlatformFee");

exports.getPlatformFee = async (req, res) => {
  try {
    let fee = await PlatformFee.findOne();
    if (!fee) fee = await PlatformFee.create({ rate: 0 });
    res.json({ rate: fee.rate });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.setPlatformFee = async (req, res) => {
  try {
    const { rate } = req.body;
    if (rate < 0 || rate > 100)
      return res.status(400).json({ message: "Platform fee must be between 0-100" });

    const fee = await PlatformFee.findOneAndUpdate({}, { rate }, { new: true, upsert: true });
    res.json({ rate: fee.rate, message: "Platform fee updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
