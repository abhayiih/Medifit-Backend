const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const userRoutes = require("./routes/userRoutes");
const cartRoutes = require("./routes/cartRoutes");
const adminRoutes = require("./routes/admin");
const paymentRoutes = require("./routes/payment.js");
const invoiceRoutes = require("./routes/invoice");
const platformFeeRoutes = require("./routes/platformFeeRoutes");
const orderRoutes = require("./routes/orderRoutes");

dotenv.config();


connectDB();

const app = express();



app.use(cors());
app.use(express.json());


// Routes
app.use("/uploads", express.static("uploads"));
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/payment", invoiceRoutes);
app.use("/api/admin/platform-fee", platformFeeRoutes);
app.use("/api/orders", orderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
