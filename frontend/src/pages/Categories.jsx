// pages/Categories.jsx
// Shows all eight categories. Clicking one opens the Products page for it.

import { CATEGORIES } from "../utils/constants";
import CategoryCard from "../components/CategoryCard";

function Categories() {
  return (
    <div className="page">
      <h1 className="page-title">Shop by Category</h1>
      <p className="page-subtitle">Pick a category to see its products.</p>

      <div className="category-grid category-grid-large">
        {CATEGORIES.map((c) => (
          <CategoryCard key={c.name} category={c} showText />
        ))}
      </div>
    </div>
  );
}

export default Categories;
