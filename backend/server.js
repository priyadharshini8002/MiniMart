// server.js
// The starting point of the backend.
// It connects to MongoDB, adds middleware, mounts all API routes and starts listening.

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load values from the .env file into process.env (must happen first)
dotenv.config();

const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

// Middleware
app.use(cors()); // allows the React app (different port) to call this API
app.use(express.json()); // lets us read JSON sent in request bodies

// Test routes
app.get("/", (req, res) => res.json({ message: "Welcome to the MiniMart API" }));
app.get("/api/health", (req, res) => res.json({ status: "ok", time: new Date().toISOString() }));

// API routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/payment", require("./routes/paymentRoutes"));

// Error handling (must be last)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Exported so tests can start the app on their own
module.exports = app;

if (require.main === module) {
  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is missing. Copy .env.example to .env and fill it in.");
    process.exit(1);
  }
  connectDB().then(() => {
    app.listen(PORT, () => console.log(`MiniMart server running on http://localhost:${PORT}`));
  });
}
