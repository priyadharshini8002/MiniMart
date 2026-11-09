// utils/pricing.js
// Delivery rule: free delivery for orders of Rs.499 or more, otherwise Rs.40.
// The frontend uses the same rule only to DISPLAY prices.
// The backend always recalculates, so prices cannot be changed by the browser.

const FREE_DELIVERY_ABOVE = 499;
const DELIVERY_CHARGE = 40;

// items = [{ price, quantity }]
const calculateTotals = (items) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryCharge = subtotal === 0 || subtotal >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_CHARGE;
  return { subtotal, deliveryCharge, totalAmount: subtotal + deliveryCharge };
};

module.exports = { FREE_DELIVERY_ABOVE, DELIVERY_CHARGE, calculateTotals };
