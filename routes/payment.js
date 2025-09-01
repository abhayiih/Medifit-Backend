const dotenv = require("dotenv");
const express = require("express");
const Stripe = require("stripe");
const router = express.Router();

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // use Secret key

// Create Checkout Session
router.post("/create-checkout-session", async (req, res) => {
  try {
    const { amount, shippingAddress, subtotal, gst, platformFee, platformFeePercent, userId } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: { name: "Order Payment" },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:5173/success/{CHECKOUT_SESSION_ID}`,
      cancel_url: "http://localhost:5173/cancel",
      client_reference_id: userId,
      metadata: {
        shippingAddress: JSON.stringify(shippingAddress),
        subtotal,
        gst,
        platformFee,
        platformFeePercent,
      },
    });

    res.json({ id: session.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Payment session creation failed" });
  }
});


// Fetch Stripe session for Success page
router.get("/session/:id", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.id);

    // Parse metadata
    const shippingAddress = session.metadata?.shippingAddress
      ? JSON.parse(session.metadata.shippingAddress)
      : {};

    const subtotal = session.metadata?.subtotal;
    const gst = session.metadata?.gst;
    const platformFee = session.metadata?.platformFee;
    const platformFeePercent = session.metadata?.platformFeePercent;

    res.json({
      shippingAddress,
      subtotal,
      gst,
      platformFee,
      platformFeePercent,
      totalAmount: session.amount_total / 100,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch session" });
  }
});

module.exports = router;
