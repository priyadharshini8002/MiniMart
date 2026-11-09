// controllers/paymentController.js
// Razorpay payments. Security rules followed here:
//   1. The payment order is created on the BACKEND, using the cart total from the database.
//   2. The secret key stays in .env and is never sent to the browser.
//   3. The payment is only accepted after the signature is verified on the BACKEND.
//   4. An order is created ONLY after successful verification.

const crypto = require("crypto");
const Razorpay = require("razorpay");
const Payment = require("../models/Payment");
const Order = require("../models/Order");
const { asyncHandler, httpError } = require("../utils/asyncHandler");
const { validateAddress } = require("../utils/validators");
const { getCartSummary, createOrderFromCart } = require("../utils/orderHelper");
const { pickAddress } = require("./orderController");

const razorpayConfigured = () =>
  Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);

// POST /api/payment/create-order
const createPaymentOrder = asyncHandler(async (req, res) => {
  if (!razorpayConfigured()) {
    throw httpError(
      503,
      "Online payment is not set up yet. Please choose Cash on Delivery or see the README to add Razorpay test keys."
    );
  }

  // Amount comes from the cart in the database, NOT from the browser
  const summary = await getCartSummary(req.user._id);

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  let rzpOrder;
  try {
    rzpOrder = await razorpay.orders.create({
      amount: Math.round(summary.totalAmount * 100), // Razorpay uses paise (1 Rs = 100 paise)
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    });
  } catch (error) {
    throw httpError(502, "Could not reach Razorpay. Check your test keys and internet connection.");
  }

  await Payment.create({
    user: req.user._id,
    razorpayOrderId: rzpOrder.id,
    amount: summary.totalAmount,
    currency: "INR",
    status: "Created",
  });

  res.status(201).json({
    razorpayOrderId: rzpOrder.id,
    amount: rzpOrder.amount, // in paise
    currency: rzpOrder.currency,
    keyId: process.env.RAZORPAY_KEY_ID, // the PUBLIC key id is safe to share
  });
});

// Checks the signature Razorpay sends after payment
const isSignatureValid = (orderId, paymentId, signature) => {
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  const a = Buffer.from(expected);
  const b = Buffer.from(String(signature || ""));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
};

// POST /api/payment/verify
// body: { razorpay_order_id, razorpay_payment_id, razorpay_signature, shippingAddress }
const verifyPayment = asyncHandler(async (req, res) => {
  if (!razorpayConfigured()) throw httpError(503, "Online payment is not set up");

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, shippingAddress } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    throw httpError(400, "Payment details are missing");
  }

  const addressError = validateAddress(shippingAddress);
  if (addressError) throw httpError(400, addressError);

  const payment = await Payment.findOne({
    razorpayOrderId: razorpay_order_id,
    user: req.user._id,
  });
  if (!payment) throw httpError(404, "Payment record not found");

  // Already verified before? Return the same order (safe to call twice)
  if (payment.status === "Paid" && payment.order) {
    const existing = await Order.findById(payment.order);
    return res.json({ order: existing });
  }

  // Signature check
  if (!isSignatureValid(razorpay_order_id, razorpay_payment_id, razorpay_signature)) {
    payment.status = "Failed";
    await payment.save();
    throw httpError(400, "Payment verification failed. You have not been charged an order.");
  }

  // The cart must still match the amount that was paid
  const summary = await getCartSummary(req.user._id);
  if (summary.totalAmount !== payment.amount) {
    throw httpError(400, "Your cart changed after payment started. Please contact support.");
  }

  const order = await createOrderFromCart({
    userId: req.user._id,
    shippingAddress: pickAddress(shippingAddress),
    paymentMethod: "Razorpay",
    paymentStatus: "Paid",
    razorpayPaymentId: razorpay_payment_id,
  });

  payment.status = "Paid";
  payment.razorpayPaymentId = razorpay_payment_id;
  payment.razorpaySignature = razorpay_signature;
  payment.order = order._id;
  await payment.save();

  res.json({ order });
});

module.exports = { createPaymentOrder, verifyPayment, isSignatureValid };
