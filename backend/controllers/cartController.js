// controllers/cartController.js
// Cart stored in MongoDB for each logged-in user.

const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { asyncHandler, httpError } = require("../utils/asyncHandler");

// Finds (or creates) the user's cart and returns it with product details
const loadCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) cart = await Cart.create({ user: userId, items: [] });
  await cart.populate("items.product");
  return cart;
};

// Shape of the response sent to the browser
const cartResponse = (cart) => ({
  items: cart.items
    .filter((i) => i.product) // skip deleted products
    .map((i) => ({ product: i.product, quantity: i.quantity })),
});

// GET /api/cart
const getCart = asyncHandler(async (req, res) => {
  const cart = await loadCart(req.user._id);
  res.json(cartResponse(cart));
});

// POST /api/cart   body: { productId, quantity }
const addToCart = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const quantity = Number(req.body.quantity) || 1;

  if (!productId) throw httpError(400, "productId is required");
  if (!Number.isInteger(quantity) || quantity < 1) throw httpError(400, "Quantity must be 1 or more");

  const product = await Product.findById(productId);
  if (!product) throw httpError(404, "Product not found");
  if (product.stock === 0) throw httpError(400, `${product.name} is out of stock`);

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = new Cart({ user: req.user._id, items: [] });

  const existing = cart.items.find((i) => i.product.toString() === productId);
  const newQuantity = (existing ? existing.quantity : 0) + quantity;

  // Do not allow more than the available stock
  if (newQuantity > product.stock) {
    throw httpError(400, `Only ${product.stock} available in stock`);
  }

  if (existing) existing.quantity = newQuantity;
  else cart.items.push({ product: productId, quantity });

  await cart.save();
  await cart.populate("items.product");
  res.status(201).json(cartResponse(cart));
});

// PUT /api/cart/:productId   body: { quantity }
const updateCartItem = asyncHandler(async (req, res) => {
  const quantity = Number(req.body.quantity);
  if (!Number.isInteger(quantity) || quantity < 1) throw httpError(400, "Quantity must be 1 or more");

  const product = await Product.findById(req.params.productId);
  if (!product) throw httpError(404, "Product not found");
  if (quantity > product.stock) throw httpError(400, `Only ${product.stock} available in stock`);

  const cart = await Cart.findOne({ user: req.user._id });
  const item = cart && cart.items.find((i) => i.product.toString() === req.params.productId);
  if (!item) throw httpError(404, "Item is not in your cart");

  item.quantity = quantity;
  await cart.save();
  await cart.populate("items.product");
  res.json(cartResponse(cart));
});

// DELETE /api/cart/:productId
const removeCartItem = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) throw httpError(404, "Cart not found");

  cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId);
  await cart.save();
  await cart.populate("items.product");
  res.json(cartResponse(cart));
});

module.exports = { getCart, addToCart, updateCartItem, removeCartItem };
