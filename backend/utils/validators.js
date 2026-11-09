// utils/validators.js
// Simple input checks for Indian phone numbers, PIN codes, emails and addresses.

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || "");

// Removes spaces, dashes and a leading +91 / 91 / 0
const cleanPhone = (phone) => {
  let p = String(phone || "").replace(/[\s-]/g, "");
  if (p.startsWith("+91")) p = p.slice(3);
  else if (p.length === 12 && p.startsWith("91")) p = p.slice(2);
  else if (p.length === 11 && p.startsWith("0")) p = p.slice(1);
  return p;
};

// Indian mobile numbers are 10 digits and start with 6, 7, 8 or 9
const isValidPhone = (phone) => /^[6-9]\d{9}$/.test(cleanPhone(phone));

// Indian PIN codes are 6 digits and do not start with 0
const isValidPincode = (pin) => /^[1-9]\d{5}$/.test(String(pin || ""));

// Returns an error message, or null if the address is fine.
const validateAddress = (a) => {
  if (!a) return "Delivery details are required";
  if (!a.fullName || a.fullName.trim().length < 2) return "Full name is required";
  if (!isValidEmail(a.email)) return "Enter a valid email";
  if (!isValidPhone(a.phone)) return "Enter a valid 10-digit Indian phone number";
  if (!a.address || !a.address.trim()) return "House address is required";
  if (!a.street || !a.street.trim()) return "Street is required";
  if (!a.city || !a.city.trim()) return "City is required";
  if (!a.state || !a.state.trim()) return "State is required";
  if (!isValidPincode(a.pincode)) return "Enter a valid 6-digit PIN code";
  return null;
};

module.exports = { isValidEmail, cleanPhone, isValidPhone, isValidPincode, validateAddress };
