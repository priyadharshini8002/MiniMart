// models/Payment.js
// Records Razorpay payments. Status becomes "Paid" ONLY after the backend
// has verified the Razorpay signature.

const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    razorpayOrderId: { type: String, required: true, unique: true },
    razorpayPaymentId: { type: String, default: "" },
    razorpaySignature: { type: String, default: "" },
    amount: { type: Number, required: true }, // in rupees
    currency: { type: String, default: "INR" },
    status: { type: String, enum: ["Created", "Paid", "Failed"], default: "Created" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
