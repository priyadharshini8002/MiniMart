// components/ProductCard.jsx
// A white rounded card showing one product. Used on Home and Products pages.

import { Link } from "react-router-dom";
import { formatPrice } from "../utils/format";
import useAddToCart from "../hooks/useAddToCart";

// Shows ★★★★☆ for a rating like 4.2
export function Stars({ rating }) {
  const full = Math.round(rating);
  return (
    <span className="stars" title={`${rating} out of 5`}>
      {"★".repeat(full)}
      {"☆".repeat(5 - full)}
    </span>
  );
}

function ProductCard({ product }) {
  const addToCart = useAddToCart();
  const outOfStock = product.stock === 0;

  return (
    <div className="product-card">
      <Link to={`/products/${product._id}`} className="product-image-box">
        {product.discountPercent > 0 && (
          <span className="discount-badge">{product.discountPercent}% OFF</span>
        )}
        <img src={product.image} alt={product.name} loading="lazy" />
      </Link>

      <div className="product-info">
        <p className="product-brand">{product.brand}</p>
        <Link to={`/products/${product._id}`} className="product-name">
          {product.name}
        </Link>

        <div className="product-rating">
          <Stars rating={product.rating} /> <small>({product.numReviews.toLocaleString("en-IN")})</small>
        </div>

        <div className="product-price">
          <span className="price-now">{formatPrice(product.discountPrice)}</span>
          {product.originalPrice > product.discountPrice && (
            <span className="price-old">{formatPrice(product.originalPrice)}</span>
          )}
        </div>

        {outOfStock ? (
          <p className="stock out">Out of stock</p>
        ) : product.stock <= 5 ? (
          <p className="stock low">Only {product.stock} left!</p>
        ) : (
          <p className="stock in">In stock</p>
        )}

        <button
          className="btn btn-block"
          disabled={outOfStock}
          onClick={() => addToCart(product)}
        >
          {outOfStock ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
