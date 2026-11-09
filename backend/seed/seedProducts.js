// seed/seedProducts.js
// Run with:  npm run seed
// It deletes old products and inserts the 30 sample Indian products.

const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Product = require("../models/Product");
const productData = require("./productData");

// "Prestige Popular Pressure Cooker 5L" -> "prestige-popular-pressure-cooker-5l"
const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const seed = async () => {
  await connectDB();

  // Remove emoji (only used for drawing pictures) and add the image path
  const products = productData.map(({ emoji, ...product }) => ({
    ...product,
    image: `/products/${slugify(product.name)}.svg`,
  }));

  await Product.deleteMany({});
  await Product.create(products); // create() runs the discount % calculation

  console.log(`Done! ${products.length} products added.`);
  await mongoose.connection.close();
};

seed().catch((error) => {
  console.error("Seeding failed:", error.message);
  process.exit(1);
});

module.exports = { slugify };
