// controllers/productController.js
// Product list (with search, filters, sorting) and single product.

const Product = require("../models/Product");
const { asyncHandler, httpError } = require("../utils/asyncHandler");

// Makes user text safe to use inside a regular expression
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// GET /api/products
// Optional query: search, category, minPrice, maxPrice, sort, featured, limit
const getProducts = asyncHandler(async (req, res) => {
  const { search, category, minPrice, maxPrice, sort, featured, limit } = req.query;

  const filter = {};

  if (search && search.trim()) {
    const regex = new RegExp(escapeRegex(search.trim()), "i");
    filter.$or = [{ name: regex }, { brand: regex }];
  }

  if (category) filter.category = category;
  if (featured === "true") filter.featured = true;

  if (minPrice || maxPrice) {
    filter.discountPrice = {};
    if (minPrice) filter.discountPrice.$gte = Number(minPrice);
    if (maxPrice) filter.discountPrice.$lte = Number(maxPrice);
  }

  let sortBy = { createdAt: -1 };
  if (sort === "price_asc") sortBy = { discountPrice: 1 };
  if (sort === "price_desc") sortBy = { discountPrice: -1 };
  if (sort === "discount") sortBy = { discountPercent: -1 };

  let query = Product.find(filter).sort(sortBy);
  if (limit && Number(limit) > 0) query = query.limit(Number(limit));

  const products = await query;
  res.json({ count: products.length, products });
});

// GET /api/products/:id
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw httpError(404, "Product not found");
  res.json({ product });
});

module.exports = { getProducts, getProductById };
