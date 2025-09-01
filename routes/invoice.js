const express = require("express");
const PDFDocument = require("pdfkit");
const Order = require("../models/Order");   
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/invoice/:orderId", protect, async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({ _id: orderId, userId: req.user._id })
      .populate("items.productId");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // PDF generation
    const doc = new PDFDocument({ margin: 50 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=invoice.pdf");
    doc.pipe(res);

    // Header
    doc.fontSize(20).text("INVOICE", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Customer: ${req.user.username}`);
    doc.text(`Email: ${req.user.email}`);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`);
    doc.moveDown();

    // Table header
    doc.fontSize(14).text("Products:", { underline: true });
    const tableTop = doc.y;
    const itemSpacing = 25;
    doc.fontSize(12);
    doc.text("Product", 50, tableTop);
    doc.text("Qty", 200, tableTop);
    doc.text("Price", 250, tableTop);
    doc.text("Original", 320, tableTop);
    doc.text("Total", 430, tableTop);
    doc.moveDown(0.5);

    // Items
    let y = tableTop + itemSpacing;
    order.items.forEach((item) => {
      const totalItem = item.quantity * item.productId.price;
      doc.text(item.productId.title, 50, y);
      doc.text(item.quantity.toString(), 200, y);
      doc.text(`${item.productId.price}`, 250, y);
      doc.text(`${item.productId.originalPrice || "-"}`, 320, y);
      doc.text(`${totalItem}`, 430, y);
      y += itemSpacing;
    });

    // Summary
    const summaryX = 390;
    const summarySpacing = 15;
    let summaryY = y + 20;

    doc.text(`Subtotal: ${order.subtotal}`, summaryX, summaryY);
    summaryY += summarySpacing;

    doc.text(`GST (18%): ${order.gst}`, summaryX, summaryY);
    summaryY += summarySpacing;

    doc.text(`Platform Fee (${order.platformFeePercent}%): ${order.platformFee}`, summaryX, summaryY);
    summaryY += summarySpacing;

    doc.text("------------------------------------", summaryX, summaryY);
    summaryY += summarySpacing;

    doc.fontSize(14).text(`Grand Total: ${order.totalAmount}`, summaryX, summaryY);

    doc.end();
  } catch (err) {
    console.error("Invoice error:", err);
    res.status(500).json({ message: "Failed to generate invoice" });
  }
});

module.exports = router;
