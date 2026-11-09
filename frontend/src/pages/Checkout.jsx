// pages/Checkout.jsx
// Step 1 of ordering: delivery details. The details are checked, saved for the
// next step (Payment page) and the user continues to /payment.

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { INDIAN_STATES } from "../utils/constants";
import { isValidEmail, isValidPhone, isValidPincode } from "../utils/format";
import OrderSummary from "../components/OrderSummary";
import Loader from "../components/Loader";

function Checkout() {
  const { user } = useAuth();
  const { items, loading } = useCart();
  const navigate = useNavigate();

  // Start with details saved earlier in this visit, or the user's profile
  const saved = JSON.parse(sessionStorage.getItem("minimart_shipping") || "null");
  const [form, setForm] = useState(
    saved || {
      fullName: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
      street: "",
      city: user.city || "",
      state: user.state || "",
      pincode: user.pincode || "",
    }
  );
  const [errors, setErrors] = useState({});

  // An empty cart cannot be checked out
  useEffect(() => {
    if (!loading && items.length === 0) navigate("/cart", { replace: true });
  }, [loading, items, navigate]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const e = {};
    if (form.fullName.trim().length < 2) e.fullName = "Enter your full name";
    if (!isValidEmail(form.email)) e.email = "Enter a valid email address";
    if (!isValidPhone(form.phone)) e.phone = "Enter a valid 10-digit mobile number";
    if (!form.address.trim()) e.address = "Enter your house / flat address";
    if (!form.street.trim()) e.street = "Enter your street";
    if (!form.city.trim()) e.city = "Enter your city";
    if (!form.state) e.state = "Select your state";
    if (!isValidPincode(form.pincode)) e.pincode = "Enter a valid 6-digit PIN code";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    sessionStorage.setItem("minimart_shipping", JSON.stringify(form));
    navigate("/payment");
  };

  if (loading) return <Loader />;

  return (
    <div className="page">
      <h1 className="page-title">Checkout</h1>
      <p className="steps">1. Delivery Details → <span>2. Payment</span> → <span>3. Confirmation</span></p>

      <div className="cart-layout">
        <form className="form-card" onSubmit={handleSubmit} noValidate>
          <h3>Delivery Details</h3>

          <div className="form-grid">
            <label>
              Full Name
              <input name="fullName" value={form.fullName} onChange={handleChange} />
              {errors.fullName && <span className="field-error">{errors.fullName}</span>}
            </label>

            <label>
              Email
              <input type="email" name="email" value={form.email} onChange={handleChange} />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </label>

            <label>
              Phone Number
              <div className="phone-input">
                <span>+91</span>
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} maxLength={13} />
              </div>
              {errors.phone && <span className="field-error">{errors.phone}</span>}
            </label>

            <label>
              House / Flat Address
              <input name="address" value={form.address} onChange={handleChange} placeholder="No. 12, Flat 3B" />
              {errors.address && <span className="field-error">{errors.address}</span>}
            </label>

            <label>
              Street
              <input name="street" value={form.street} onChange={handleChange} placeholder="Gandhi Road" />
              {errors.street && <span className="field-error">{errors.street}</span>}
            </label>

            <label>
              City
              <input name="city" value={form.city} onChange={handleChange} />
              {errors.city && <span className="field-error">{errors.city}</span>}
            </label>

            <label>
              State
              <select name="state" value={form.state} onChange={handleChange}>
                <option value="">Select state</option>
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {errors.state && <span className="field-error">{errors.state}</span>}
            </label>

            <label>
              PIN Code
              <input name="pincode" value={form.pincode} onChange={handleChange} maxLength={6} placeholder="600001" />
              {errors.pincode && <span className="field-error">{errors.pincode}</span>}
            </label>
          </div>

          <button className="btn">Continue to Payment</button>
          <Link to="/cart" className="continue-link">← Back to Cart</Link>
        </form>

        <OrderSummary showItems />
      </div>
    </div>
  );
}

export default Checkout;
