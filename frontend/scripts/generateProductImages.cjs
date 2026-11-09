// scripts/generateProductImages.cjs
// Creates one simple brown/cream picture (SVG) for every product in
// backend/seed/productData.js and saves it in frontend/public/products/.
//
// Run with:  npm run images   (inside the frontend folder)
//
// These are placeholder pictures that work offline. To use real product photos,
// put your own images in frontend/public/products/ with the same file names.

const fs = require("fs");
const path = require("path");
const products = require("../../backend/seed/productData");

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const escapeXml = (t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const outDir = path.join(__dirname, "..", "public", "products");
fs.mkdirSync(outDir, { recursive: true });

products.forEach((p) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#FFF8F0"/>
      <stop offset="1" stop-color="#F5EBDD"/>
    </linearGradient>
  </defs>
  <rect width="600" height="600" fill="url(#bg)"/>
  <circle cx="300" cy="275" r="190" fill="#FFFFFF" stroke="#E5D5C3" stroke-width="4"/>
  <circle cx="300" cy="275" r="160" fill="#F5EBDD"/>
  <text x="300" y="275" font-size="190" text-anchor="middle" dominant-baseline="central">${p.emoji}</text>
  <rect x="150" y="490" width="300" height="44" rx="22" fill="#5D4037"/>
  <text x="300" y="513" font-family="Arial, sans-serif" font-size="22" font-weight="bold" fill="#FFFFFF" text-anchor="middle" dominant-baseline="central">${escapeXml(p.brand)}</text>
</svg>
`;
  fs.writeFileSync(path.join(outDir, `${slugify(p.name)}.svg`), svg);
});

console.log(`Created ${products.length} product pictures in ${outDir}`);
