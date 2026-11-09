// controllers/orderController.js
// Cash on Delivery orders, order history and single order.
// (Razorpay orders are created in paymentController after the payment is verified.)

const mongoose = require("mongoose");
const Order = require("../models/Order");
const { asyncHandler, httpError } = require("../utils/asyncHandler");
const { validateAddress, cleanPhone } = require("../utils/validators");
const { createOrderFromCart } = require("../utils/orderHelper");

// Keeps only the address fields we expect
const pickAddress = (a) => ({
  fullName: a.fullName.trim(),
  email: a.email.trim().toLowerCase(),
  phone: cleanPhone(a.phone),
  address: a.address.trim(),
  street: a.street.trim(),
  city: a.city.trim(),
  state: a.state.trim(),
  pincode: String(a.pincode),
});

// POST /api/orders   body: { shippingAddress, paymentMethod: "COD" }
const placeOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod } = req.body;

  if (paymentMethod !== "COD") {
    throw httpError(400, "Online payments are confirmed through /api/payment/verify");
  }

  const addressError = validateAddress(shippingAddress);
  if (addressError) throw httpError(400, addressError);

  const order = await createOrderFromCart({
    userId: req.user._id,
    shippingAddress: pickAddress(shippingAddress),
    paymentMethod: "COD",
    paymentStatus: "Pending", // cash is paid when the parcel arrives
  });

  res.status(201).json({ order });
});

// GET /api/orders/my-orders
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ orders });
});

// GET /api/orders/:id   (works with the database id or the MM-... order id)
const getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const order = mongoose.isValidObjectId(id)
    ? await Order.findById(id)
    : await Order.findOne({ orderId: id });

  // Same message for "missing" and "not yours" so we do not leak information
  if (!order || order.user.toString() !== req.user._id.toString()) {
    throw httpError(404, "Order not found");
  }

  res.json({ order });
});

module.exports = { placeOrder, getMyOrders, getOrderById, pickAddress };
