// seed/productData.js
// 30 sample Indian products. Prices are in Indian Rupees (Rs.).
// "emoji" is only used to draw the product pictures (see frontend/scripts/generateProductImages.js).
// To use real photos later, replace the image path in seedProducts.js or in the database.

const products = [
  // ---------- Electronics ----------
  {
    name: "boAt Bassheads 100 Wired Earphones",
    brand: "boAt",
    category: "Electronics",
    emoji: "🎧",
    description: "In-ear wired earphones with powerful bass, built-in mic and tangle-free cable. Comes with a 3.5mm jack.",
    originalPrice: 999, discountPrice: 399, rating: 4.1, numReviews: 5230, stock: 40, featured: true,
  },
  {
    name: "boAt Stone 352 Bluetooth Speaker",
    brand: "boAt",
    category: "Electronics",
    emoji: "🔊",
    description: "10W portable Bluetooth speaker with up to 12 hours playback, IPX7 water resistance and a rich stereo sound.",
    originalPrice: 2990, discountPrice: 1099, rating: 4.2, numReviews: 3120, stock: 25, featured: true,
  },
  {
    name: "Ambrane 20W Fast Mobile Charger",
    brand: "Ambrane",
    category: "Electronics",
    emoji: "🔌",
    description: "20W fast charger with Type-C port and short-circuit protection. Works with most Android phones.",
    originalPrice: 999, discountPrice: 499, rating: 4.0, numReviews: 1840, stock: 60, featured: false,
  },
  {
    name: "Noise ColorFit Pulse Smart Watch",
    brand: "Noise",
    category: "Electronics",
    emoji: "⌚",
    description: "1.8 inch display smart watch with Bluetooth calling, heart-rate monitor, SpO2 and 100+ watch faces.",
    originalPrice: 4999, discountPrice: 1499, rating: 4.0, numReviews: 9800, stock: 18, featured: true,
  },
  {
    name: "boAt Rockerz 450 Bluetooth Headphones",
    brand: "boAt",
    category: "Electronics",
    emoji: "🎧",
    description: "On-ear wireless headphones with 40mm drivers, 15 hours battery life and soft padded ear cushions.",
    originalPrice: 3990, discountPrice: 1299, rating: 4.1, numReviews: 7410, stock: 22, featured: false,
  },

  // ---------- Men's Fashion ----------
  {
    name: "Peter England Cotton Formal Shirt",
    brand: "Peter England",
    category: "Men's Fashion",
    emoji: "👔",
    description: "Full-sleeve slim fit formal shirt in soft cotton. Perfect for office and parties.",
    originalPrice: 1799, discountPrice: 899, rating: 4.2, numReviews: 860, stock: 35, featured: false,
  },
  {
    name: "Levi's Slim Fit Stretch Jeans",
    brand: "Levi's",
    category: "Men's Fashion",
    emoji: "👖",
    description: "Comfortable slim fit denim jeans with a little stretch and a mid-rise waist. Colour: Dark Blue.",
    originalPrice: 2999, discountPrice: 1799, rating: 4.3, numReviews: 2150, stock: 28, featured: true,
  },
  {
    name: "Fabindia Cotton Kurta",
    brand: "Fabindia",
    category: "Men's Fashion",
    emoji: "🥻",
    description: "Traditional straight kurta in breathable pure cotton. Ideal for festivals and daily wear.",
    originalPrice: 1999, discountPrice: 1299, rating: 4.4, numReviews: 640, stock: 20, featured: false,
  },

  // ---------- Women's Fashion ----------
  {
    name: "Tamil Weaves Handloom Cotton Saree",
    brand: "Tamil Weaves",
    category: "Women's Fashion",
    emoji: "🥻",
    description: "Soft handloom cotton saree with a traditional zari border and blouse piece. Easy to drape and wash.",
    originalPrice: 1799, discountPrice: 999, rating: 4.5, numReviews: 1320, stock: 15, featured: true,
  },
  {
    name: "Biba Printed Designer Kurti",
    brand: "Biba",
    category: "Women's Fashion",
    emoji: "👚",
    description: "Straight-fit kurti with beautiful block prints and three-quarter sleeves. Made from soft rayon.",
    originalPrice: 1999, discountPrice: 1199, rating: 4.3, numReviews: 980, stock: 30, featured: false,
  },
  {
    name: "Libas Cotton Chudidar Set",
    brand: "Libas",
    category: "Women's Fashion",
    emoji: "👗",
    description: "Three-piece chudidar set with kurta, churidar and dupatta in comfortable cotton fabric.",
    originalPrice: 1599, discountPrice: 899, rating: 4.1, numReviews: 540, stock: 24, featured: false,
  },
  {
    name: "Go Colors Cotton Leggings",
    brand: "Go Colors",
    category: "Women's Fashion",
    emoji: "🩱",
    description: "Ankle-length stretchable cotton leggings that fit well and stay soft after many washes.",
    originalPrice: 699, discountPrice: 399, rating: 4.4, numReviews: 4100, stock: 80, featured: false,
  },

  // ---------- Footwear ----------
  {
    name: "Bata Men's Leather Sandals",
    brand: "Bata",
    category: "Footwear",
    emoji: "🩴",
    description: "Durable brown leather sandals with cushioned footbed and adjustable velcro straps.",
    originalPrice: 1299, discountPrice: 799, rating: 4.0, numReviews: 1100, stock: 33, featured: false,
  },
  {
    name: "Metro Women's Casual Flats",
    brand: "Metro",
    category: "Footwear",
    emoji: "🥿",
    description: "Stylish and comfortable flats for daily wear with a soft sole and light weight.",
    originalPrice: 1499, discountPrice: 899, rating: 4.2, numReviews: 720, stock: 26, featured: false,
  },
  {
    name: "Campus Men's Casual Shoes",
    brand: "Campus",
    category: "Footwear",
    emoji: "👟",
    description: "Lightweight sports-style casual shoes with strong grip sole. Good for walking and everyday use.",
    originalPrice: 1999, discountPrice: 1199, rating: 4.1, numReviews: 3560, stock: 3, featured: true,
  },

  // ---------- Home & Kitchen ----------
  {
    name: "Prestige Popular Pressure Cooker 5L",
    brand: "Prestige",
    category: "Home & Kitchen",
    emoji: "🍲",
    description: "5 litre aluminium pressure cooker with a safety valve and a strong handle. Ideal for a family of 4 to 6.",
    originalPrice: 2200, discountPrice: 1499, rating: 4.5, numReviews: 8800, stock: 30, featured: true,
  },
  {
    name: "Preethi Zodiac Mixer Grinder 750W",
    brand: "Preethi",
    category: "Home & Kitchen",
    emoji: "🥤",
    description: "750W mixer grinder with 5 jars, strong motor and Master Chef jars for wet and dry grinding.",
    originalPrice: 6995, discountPrice: 4999, rating: 4.4, numReviews: 2600, stock: 12, featured: false,
  },
  {
    name: "Milton Thermosteel Water Bottle 1L",
    brand: "Milton",
    category: "Home & Kitchen",
    emoji: "🧴",
    description: "Stainless steel vacuum insulated bottle that keeps water hot for 24 hours and cold for 24 hours.",
    originalPrice: 899, discountPrice: 649, rating: 4.3, numReviews: 6700, stock: 50, featured: false,
  },
  {
    name: "Hawkins Non-Stick Cookware Set",
    brand: "Hawkins",
    category: "Home & Kitchen",
    emoji: "🍳",
    description: "Set of 3 non-stick cookware pieces: tawa, kadai and frying pan. Works on gas stove.",
    originalPrice: 2499, discountPrice: 1699, rating: 4.2, numReviews: 1450, stock: 16, featured: false,
  },

  // ---------- Beauty & Personal Care ----------
  {
    name: "Himalaya Neem Face Wash 150ml",
    brand: "Himalaya",
    category: "Beauty & Personal Care",
    emoji: "🧼",
    description: "Herbal neem and turmeric face wash that cleans oil and helps prevent pimples. Suitable for daily use.",
    originalPrice: 199, discountPrice: 149, rating: 4.4, numReviews: 15400, stock: 100, featured: false,
  },
  {
    name: "Sunsilk Black Shine Shampoo 650ml",
    brand: "Sunsilk",
    category: "Beauty & Personal Care",
    emoji: "🧴",
    description: "Shampoo with amla and keratin for shiny, strong black hair. Family-size bottle.",
    originalPrice: 599, discountPrice: 449, rating: 4.2, numReviews: 3200, stock: 70, featured: false,
  },
  {
    name: "Parachute Pure Coconut Hair Oil 500ml",
    brand: "Parachute",
    category: "Beauty & Personal Care",
    emoji: "🥥",
    description: "100% pure coconut oil for healthy hair and skin. Trusted in Indian homes for many years.",
    originalPrice: 280, discountPrice: 225, rating: 4.6, numReviews: 21000, stock: 90, featured: true,
  },

  // ---------- Grocery ----------
  {
    name: "India Gate Basmati Rice 5kg",
    brand: "India Gate",
    category: "Grocery",
    emoji: "🍚",
    description: "Long grain aged basmati rice that cooks fluffy and fragrant. Perfect for biryani and pulao.",
    originalPrice: 850, discountPrice: 699, rating: 4.5, numReviews: 9100, stock: 45, featured: true,
  },
  {
    name: "Tata Sampann Toor Dal 1kg",
    brand: "Tata Sampann",
    category: "Grocery",
    emoji: "🫘",
    description: "Unpolished toor dal with natural protein and fibre. Cooks quickly and tastes great in sambar and dal fry.",
    originalPrice: 220, discountPrice: 179, rating: 4.3, numReviews: 5400, stock: 75, featured: false,
  },
  {
    name: "Fortune Sunlite Refined Sunflower Oil 1L",
    brand: "Fortune",
    category: "Grocery",
    emoji: "🌻",
    description: "Light and healthy refined sunflower cooking oil, good for everyday Indian cooking.",
    originalPrice: 190, discountPrice: 159, rating: 4.4, numReviews: 7800, stock: 85, featured: false,
  },
  {
    name: "MDH Spices Combo (Pack of 3)",
    brand: "MDH",
    category: "Grocery",
    emoji: "🌶️",
    description: "Combo pack of MDH Garam Masala, Chana Masala and Kitchen King for authentic taste.",
    originalPrice: 300, discountPrice: 249, rating: 4.5, numReviews: 2900, stock: 60, featured: false,
  },

  // ---------- Accessories ----------
  {
    name: "Baggit Women's Handbag",
    brand: "Baggit",
    category: "Accessories",
    emoji: "👜",
    description: "Stylish tote handbag with a roomy main compartment, zip pocket and strong handles. Colour: Tan.",
    originalPrice: 2499, discountPrice: 1299, rating: 4.1, numReviews: 830, stock: 14, featured: true,
  },
  {
    name: "Hidesign Men's Leather Wallet",
    brand: "Hidesign",
    category: "Accessories",
    emoji: "👛",
    description: "Genuine leather bi-fold wallet with card slots, coin pocket and note compartments.",
    originalPrice: 1895, discountPrice: 1099, rating: 4.3, numReviews: 1250, stock: 27, featured: false,
  },
  {
    name: "Fastrack Analog Wrist Watch",
    brand: "Fastrack",
    category: "Accessories",
    emoji: "⌚",
    description: "Trendy analog watch with a black dial and a durable strap. Water resistant up to 30 metres.",
    originalPrice: 2495, discountPrice: 1595, rating: 4.2, numReviews: 2020, stock: 19, featured: false,
  },
  {
    name: "Woodland Men's Leather Belt",
    brand: "Woodland",
    category: "Accessories",
    emoji: "🪢",
    description: "Reversible genuine leather belt with a strong metal buckle. Fits waist sizes 30 to 38.",
    originalPrice: 999, discountPrice: 599, rating: 4.0, numReviews: 970, stock: 0, featured: false,
  },
];

module.exports = products;
