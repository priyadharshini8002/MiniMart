// models/Order.js
// A placed order. Product name, image and price are copied into the order
// so the order stays correct even if the product changes later.

const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true }, // e.g. MM-20261105-4821
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: String,
        image: String,
        price: Number,
        quantity: Number,
      },
    ],
    shippingAddress: {
      fullName: String,
      email: String,
      phone: String,
      address: String,
      street: String,
      city: String,
      state: String,
      pincode: String,
    },
    paymentMethod: { type: String, enum: ["COD", "Razorpay"], required: true },
    paymentStatus: { type: String, enum: ["Pending", "Paid"], default: "Pending" },
    orderStatus: {
      type: String,
      enum: ["Placed", "Shipped", "Delivered", "Cancelled"],
      default: "Placed",
    },
    subtotal: { type: Number, required: true },
    deliveryCharge: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    razorpayPaymentId: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
