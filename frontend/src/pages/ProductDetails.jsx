// pages/ProductDetails.jsx
// Full details of one product, with quantity picker and Add to Cart / Buy Now.

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api, { getErrorMessage } from "../services/api";
import { formatPrice } from "../utils/format";
import { Stars } from "../components/ProductCard";
import useAddToCart from "../hooks/useAddToCart";
import Loader from "../components/Loader";

function ProductDetails() {
  const { id } = useParams(); // the :id from the address
  const navigate = useNavigate();
  const addToCart = useAddToCart();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setError("");
      setQuantity(1);
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data.product);
      } catch (err) {
        setError(getErrorMessage(err));
      }
      setLoading(false);
    };
    loadProduct();
  }, [id]);

  if (loading) return <Loader />;

  if (error || !product) {
    return (
      <div className="page">
        <p className="error-box">{error || "Product not found"}</p>
        <Link to="/products" className="btn">Back to Products</Link>
      </div>
    );
  }

  const outOfStock = product.stock === 0;

  const handleBuyNow = async () => {
    const added = await addToCart(product, quantity);
    if (added) navigate("/cart");
  };

  return (
    <div className="page">
      <p className="breadcrumb">
        <Link to="/">Home</Link> / <Link to="/products">Products</Link> /{" "}
        <Link to={`/products?category=${encodeURIComponent(product.category)}`}>
          {product.category}
        </Link>
      </p>

      <div className="details-layout">
        <div className="details-image">
          {product.discountPercent > 0 && (
            <span className="discount-badge">{product.discountPercent}% OFF</span>
          )}
          <img src={product.image} alt={product.name} />
        </div>

        <div className="details-info">
          <p className="product-brand">{product.brand}</p>
          <h1>{product.name}</h1>

          <div className="product-rating">
            <Stars rating={product.rating} /> {product.rating} ·{" "}
            <small>{product.numReviews.toLocaleString("en-IN")} reviews</small>
          </div>

          <div className="product-price details-price">
            <span className="price-now">{formatPrice(product.discountPrice)}</span>
            {product.originalPrice > product.discountPrice && (
              <>
                <span className="price-old">{formatPrice(product.originalPrice)}</span>
                <span className="save-text">
                  You save {formatPrice(product.originalPrice - product.discountPrice)}
                </span>
              </>
            )}
          </div>
          <p className="tax-note">Inclusive of all taxes. Free delivery above ₹499.</p>

          <p className="details-description">{product.description}</p>

          <table className="details-table">
            <tbody>
              <tr><td>Category</td><td>{product.category}</td></tr>
              <tr><td>Brand</td><td>{product.brand}</td></tr>
              <tr>
                <td>Availability</td>
                <td>
                  {outOfStock ? (
                    <span className="stock out">Out of stock</span>
                  ) : (
                    <span className="stock in">In stock ({product.stock} available)</span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>

          {!outOfStock && (
            <div className="quantity-row">
              <span>Quantity:</span>
              <div className="qty-box">
                <button onClick={() => setQuantity(quantity - 1)} disabled={quantity <= 1}>−</button>
                <span>{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
            </div>
          )}

          <div className="button-row">
            <button className="btn" disabled={outOfStock} onClick={() => addToCart(product, quantity)}>
              Add to Cart
            </button>
            <button className="btn btn-outline" disabled={outOfStock} onClick={handleBuyNow}>
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
