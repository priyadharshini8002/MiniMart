// utils/orderHelper.js
// Shared logic used by both Cash on Delivery orders and Razorpay orders.
//
// getCartSummary()      -> reads the user's cart and calculates totals from DATABASE prices
// createOrderFromCart() -> checks stock, reduces stock, saves the order, empties the cart

const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Order = require("../models/Order");
const { calculateTotals } = require("./pricing");
const { httpError } = require("./asyncHandler");

const getCartSummary = async (userId) => {
  const cart = await Cart.findOne({ user: userId }).populate("items.product");

  // Ignore items whose product was deleted
  const items = (cart ? cart.items : []).filter((i) => i.product);

  if (items.length === 0) throw httpError(400, "Your cart is empty");

  // Stock check
  for (const item of items) {
    if (item.quantity > item.product.stock) {
      throw httpError(
        400,
        item.product.stock === 0
          ? `${item.product.name} is out of stock`
          : `Only ${item.product.stock} of ${item.product.name} left in stock`
      );
    }
  }

  const totals = calculateTotals(
    items.map((i) => ({ price: i.product.discountPrice, quantity: i.quantity }))
  );

  return { cart, items, ...totals };
};

// Example result: MM-20261105-4821
const generateOrderId = () => {
  const d = new Date();
  const date = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(
    d.getDate()
  ).padStart(2, "0")}`;
  const random = Math.floor(1000 + Math.random() * 9000);
  return `MM-${date}-${random}`;
};

const createOrderFromCart = async ({
  userId,
  shippingAddress,
  paymentMethod,
  paymentStatus,
  razorpayPaymentId = "",
}) => {
  const summary = await getCartSummary(userId);

  // Reduce stock. The condition "stock >= quantity" stops two buyers
  // from taking the last item at the same time.
  const reduced = [];
  try {
    for (const item of summary.items) {
      const updated = await Product.findOneAndUpdate(
        { _id: item.product._id, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } }
      );
      if (!updated) throw httpError(400, `${item.product.name} just went out of stock`);
      reduced.push(item);
    }
  } catch (error) {
    // Put back stock we already reduced
    for (const item of reduced) {
      await Product.updateOne({ _id: item.product._id }, { $inc: { stock: item.quantity } });
    }
    throw error;
  }

  const order = await Order.create({
    orderId: generateOrderId(),
    user: userId,
    items: summary.items.map((i) => ({
      product: i.product._id,
      name: i.product.name,
      image: i.product.image,
      price: i.product.discountPrice,
      quantity: i.quantity,
    })),
    shippingAddress,
    paymentMethod,
    paymentStatus,
    subtotal: summary.subtotal,
    deliveryCharge: summary.deliveryCharge,
    totalAmount: summary.totalAmount,
    razorpayPaymentId,
  });

  // Empty the cart
  await Cart.updateOne({ user: userId }, { $set: { items: [] } });

  return order;
};

module.exports = { getCartSummary, createOrderFromCart };
