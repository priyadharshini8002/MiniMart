// utils/constants.js
// Values used in many places.

// Names must match the categories in backend/models/Product.js
export const CATEGORIES = [
  { name: "Electronics", emoji: "🎧", text: "Earphones, speakers, chargers and smart watches" },
  { name: "Men's Fashion", emoji: "👔", text: "Shirts, jeans and traditional kurtas" },
  { name: "Women's Fashion", emoji: "🥻", text: "Sarees, kurtis, chudidars and leggings" },
  { name: "Footwear", emoji: "👟", text: "Sandals, flats and casual shoes" },
  { name: "Home & Kitchen", emoji: "🍲", text: "Cookers, mixers, bottles and cookware" },
  { name: "Beauty & Personal Care", emoji: "🧴", text: "Face wash, shampoo and hair oil" },
  { name: "Grocery", emoji: "🍚", text: "Rice, dal, cooking oil and spices" },
  { name: "Accessories", emoji: "👜", text: "Handbags, wallets, watches and belts" },
];

export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
  "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];

// Same delivery rule as backend/utils/pricing.js (used only for display)
export const FREE_DELIVERY_ABOVE = 499;
export const DELIVERY_CHARGE = 40;
