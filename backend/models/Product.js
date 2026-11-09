// models/Product.js
// Describes a product in the shop.

const mongoose = require("mongoose");

const CATEGORIES = [
  "Electronics",
  "Men's Fashion",
  "Women's Fashion",
  "Footwear",
  "Home & Kitchen",
  "Beauty & Personal Care",
  "Grocery",
  "Accessories",
];

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true, enum: CATEGORIES },
    originalPrice: { type: Number, required: true, min: 0 }, // price before discount (Rs.)
    discountPrice: { type: Number, required: true, min: 0 }, // price the customer pays (Rs.)
    discountPercent: { type: Number, default: 0 },
    image: { type: String, required: true },
    rating: { type: Number, default: 4, min: 0, max: 5 },
    numReviews: { type: Number, default: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Work out the discount percentage automatically before saving.
productSchema.pre("validate", function (next) {
  if (this.originalPrice > 0 && this.discountPrice < this.originalPrice) {
    this.discountPercent = Math.round(
      ((this.originalPrice - this.discountPrice) / this.originalPrice) * 100
    );
  } else {
    this.discountPercent = 0;
  }
  next();
});

const Product = mongoose.model("Product", productSchema);
Product.CATEGORIES = CATEGORIES;

module.exports = Product;
