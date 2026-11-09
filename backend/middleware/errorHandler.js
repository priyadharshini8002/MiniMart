// middleware/errorHandler.js
// Catches errors from all routes and sends a clean JSON message.

const notFound = (req, res) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
};

const errorHandler = (err, req, res, next) => {
  let status = err.statusCode || 500;
  let message = err.message || "Something went wrong";

  // Invalid MongoDB id, e.g. /api/products/abc
  if (err.name === "CastError") {
    status = 404;
    message = "Resource not found";
  }

  // Duplicate value, e.g. email already registered
  if (err.code === 11000) {
    status = 400;
    message = "This value already exists";
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    status = 400;
    message = Object.values(err.errors).map((e) => e.message).join(", ");
  }

  if (status === 500) console.error(err);

  res.status(status).json({ message });
};

module.exports = { notFound, errorHandler };
