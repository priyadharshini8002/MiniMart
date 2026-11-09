// components/CategoryCard.jsx
// A card for one category. Clicking it opens the Products page filtered by that category.

import { Link } from "react-router-dom";

function CategoryCard({ category, showText = false }) {
  return (
    <Link to={`/products?category=${encodeURIComponent(category.name)}`} className="category-card">
      <span className="category-emoji">{category.emoji}</span>
      <h3>{category.name}</h3>
      {showText && <p>{category.text}</p>}
    </Link>
  );
}

export default CategoryCard;
