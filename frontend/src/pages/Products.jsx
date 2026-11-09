// pages/Products.jsx
// All products with search, category filter, price filter and price sorting.
// The chosen filters are saved in the page address (e.g. /products?category=Grocery&sort=price_asc)
// so the Back button and shared links work properly.

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api, { getErrorMessage } from "../services/api";
import { CATEGORIES } from "../utils/constants";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";

// Price ranges shown in the dropdown. "min-max", empty means no limit.
const PRICE_RANGES = [
  { value: "", label: "Any price" },
  { value: "0-500", label: "Under ₹500" },
  { value: "500-1000", label: "₹500 - ₹1,000" },
  { value: "1000-2000", label: "₹1,000 - ₹2,000" },
  { value: "2000-", label: "Above ₹2,000" },
];

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const price = searchParams.get("price") || "";
  const sort = searchParams.get("sort") || "";

  const [searchText, setSearchText] = useState(search);

  // Keep the search box in sync when the navbar search changes the address
  useEffect(() => {
    setSearchText(search);
  }, [search]);

  // Load products every time a filter changes
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError("");

      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;
      if (sort) params.sort = sort;
      if (price) {
        const [min, max] = price.split("-");
        if (min) params.minPrice = min;
        if (max) params.maxPrice = max;
      }

      try {
        const { data } = await api.get("/products", { params });
        setProducts(data.products);
      } catch (err) {
        setError(getErrorMessage(err));
      }
      setLoading(false);
    };
    loadProducts();
  }, [search, category, price, sort]);

  // Change one filter in the address
  const setFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilter("search", searchText.trim());
  };

  const clearFilters = () => {
    setSearchText("");
    setSearchParams({});
  };

  const hasFilters = search || category || price || sort;

  return (
    <div className="page">
      <h1 className="page-title">{category || "All Products"}</h1>

      <div className="filter-bar">
        <form onSubmit={handleSearch} className="filter-search">
          <input
            type="text"
            placeholder="Search by product name or brand"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <button type="submit" className="btn">Search</button>
        </form>

        <select value={category} onChange={(e) => setFilter("category", e.target.value)}>
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.name} value={c.name}>{c.name}</option>
          ))}
        </select>

        <select value={price} onChange={(e) => setFilter("price", e.target.value)}>
          {PRICE_RANGES.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>

        <select value={sort} onChange={(e) => setFilter("sort", e.target.value)}>
          <option value="">Newest first</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="discount">Biggest discount</option>
        </select>

        {hasFilters && (
          <button className="btn btn-outline" onClick={clearFilters}>Clear</button>
        )}
      </div>

      {search && (
        <p className="result-text">
          Showing results for "<strong>{search}</strong>"
        </p>
      )}

      {loading ? (
        <Loader text="Loading products..." />
      ) : error ? (
        <p className="error-box">{error}</p>
      ) : products.length === 0 ? (
        <div className="empty-box">
          <p>😕 No products found. Try a different search or filter.</p>
        </div>
      ) : (
        <>
          <p className="result-text">{products.length} products</p>
          <div className="product-grid">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Products;
