// pages/Home.jsx
// Hero banner, categories, featured products, special offers and "Why choose us".

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { getErrorMessage } from "../services/api";
import { CATEGORIES } from "../utils/constants";
import CategoryCard from "../components/CategoryCard";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";

function Home() {
  const [featured, setFeatured] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        // Two requests at the same time
        const [featuredRes, offersRes] = await Promise.all([
          api.get("/products?featured=true&limit=8"),
          api.get("/products?sort=discount&limit=4"),
        ]);
        setFeatured(featuredRes.data.products);
        setOffers(offersRes.data.products);
      } catch (err) {
        setError(getErrorMessage(err));
      }
      setLoading(false);
    };
    loadProducts();
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <div className="hero-text">
          <h1>Welcome to MiniMart</h1>
          <p className="hero-sub">Online Shopping Made Easy</p>
          <p>
            Fashion, electronics, home needs and groceries from trusted Indian brands, delivered
            to your door. Free delivery on orders above ₹499.
          </p>
          <Link to="/products" className="btn btn-light">Shop Now</Link>
        </div>
        <div className="hero-art" aria-hidden="true">
          <span>🛍️</span>
          <span>🥻</span>
          <span>🎧</span>
          <span>🍲</span>
        </div>
      </section>

      {/* Categories */}
      <section className="section">
        <h2 className="section-title">Shop by Category</h2>
        <div className="category-grid">
          {CATEGORIES.map((c) => (
            <CategoryCard key={c.name} category={c} />
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="section section-cream">
        <h2 className="section-title">Featured Products</h2>
        {loading ? (
          <Loader />
        ) : error ? (
          <p className="error-box">{error}</p>
        ) : (
          <div className="product-grid">
            {featured.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Special offers */}
      <section className="section">
        <h2 className="section-title">Special Offers</h2>
        {!loading && !error && (
          <div className="product-grid">
            {offers.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
        <div className="center-row">
          <Link to="/products?sort=discount" className="btn btn-outline">View All Offers</Link>
        </div>
      </section>

      {/* Why choose us */}
      <section className="section section-beige">
        <h2 className="section-title">Why Choose Us</h2>
        <div className="why-grid">
          <div className="why-card">
            <span>✅</span>
            <h3>Quality Products</h3>
            <p>Products from trusted Indian and popular brands.</p>
          </div>
          <div className="why-card">
            <span>💰</span>
            <h3>Affordable Prices</h3>
            <p>Great discounts and free delivery above ₹499.</p>
          </div>
          <div className="why-card">
            <span>🛒</span>
            <h3>Easy Shopping</h3>
            <p>Search, filter and order in just a few clicks.</p>
          </div>
          <div className="why-card">
            <span>🔒</span>
            <h3>Secure Payments</h3>
            <p>Pay with Cash on Delivery or secure Razorpay.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
