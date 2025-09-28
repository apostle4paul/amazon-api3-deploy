const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();

// Middleware
app.use(cors({ origin: true }));
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Server is running!",
  });
});

// Payment endpoint
app.post("/payment/create", async (req, res) => {
  const total = parseInt(req.query.total);

  console.log("Payment request received, total:", total);

  if (!total || total <= 0) {
    return res.status(400).json({
      message: "You have to select an item to pay.",
    });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: "usd",
    });

    res.status(201).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Amazon Server Running on PORT: ${PORT}, http://localhost:${PORT}`);
});
