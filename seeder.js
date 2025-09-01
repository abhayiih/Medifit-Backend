const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const Product = require("./models/Product");
const products = require("./productsData");

dotenv.config();
connectDB();

const importData = async () => {
  try {
    // await Product.deleteMany(); 
    await Product.insertMany(products); 
    console.log("Data Imported!");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

importData();
