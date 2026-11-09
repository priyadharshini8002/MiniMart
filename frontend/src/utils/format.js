// utils/format.js
// Helpers for showing prices, dates and checking form values.

// 1499 -> ₹1,499  (Indian number format)
export const formatPrice = (amount) => `₹${Number(amount).toLocaleString("en-IN")}`;

// "2026-11-05T04:10:00Z" -> "5 November 2026, 9:40 am"
export const formatDate = (dateString) =>
  new Date(dateString).toLocaleString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// 10 digits, starting with 6-9. Allows a +91 in front.
export const isValidPhone = (phone) =>
  /^[6-9]\d{9}$/.test(String(phone).replace(/[\s-]/g, "").replace(/^(\+91|91|0)(?=\d{10}$)/, ""));

// 6 digits, not starting with 0
export const isValidPincode = (pin) => /^[1-9]\d{5}$/.test(pin);
