const express = require("express");
const { getProducts, getProductById,createProduct , updateProduct , deleteProduct } = require('../controllers/productController');
const router = express.Router();
const multer = require("multer");
const {protect, admin} =require('../middleware/authMiddleware')

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now()+"-"+file.originalname); 
  },
});

const upload = multer({ storage });

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/",protect, admin, upload.single("image"), createProduct);
router.put("/:id", protect, admin ,upload.single("image"), updateProduct);
router.delete("/:id",protect, admin ,upload.single("image"), deleteProduct);


module.exports = router;
