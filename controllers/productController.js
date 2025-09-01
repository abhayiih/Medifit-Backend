const Product = require("../models/Product");


const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  }catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProduct = async(req,res) => {
    try {
    const image = req.file ? `/uploads/${req.file.filename}` : req.body.image;

    const product = new Product({
      title: req.body.title,
      price: req.body.price,
      originalPrice: req.body.originalPrice,
      category: req.body.category,
      chip: req.body.chip,
      image: image,
    });

    {""}

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
   
    const image = req.file ? `/uploads/${req.file.filename}` : product.image;
   
    product.title = req.body.title || product.title;
    product.price = req.body.price || product.price;
    product.originalPrice = req.body.originalPrice || product.originalPrice;
    product.category = req.body.category || product.category;
    product.chip = req.body.chip || product.chip;
    product.image = image;

    const updatedProduct = await product.save();
    res.json(updatedProduct);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

      await Product.deleteOne({ _id: req.params.id });

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

 

module.exports = { getProducts, getProductById , createProduct , updateProduct,deleteProduct };