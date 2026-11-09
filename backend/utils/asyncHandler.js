// utils/asyncHandler.js
// Express 4 does not catch errors from async functions by itself.
// This small wrapper sends any error to our errorHandler middleware.

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Helper to create an error that carries an HTTP status code.
const httpError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

module.exports = { asyncHandler, httpError };
