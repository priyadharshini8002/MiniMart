// pages/About.jsx

import { Link } from "react-router-dom";

function About() {
  return (
    <div className="page">
      <h1 className="page-title">About MiniMart</h1>

      <div className="text-card">
        <p>
          MiniMart is a simple online shop made for Indian families. We bring fashion, electronics,
          kitchen items, beauty products and daily groceries together in one easy place.
        </p>
        <p>
          Our goal is to make online shopping easy: find what you need, put it in your cart, pay
          safely with Cash on Delivery or Razorpay, and get it at your door.
        </p>
        <p>
          MiniMart is built with the MERN stack (MongoDB, Express.js, React and Node.js) as part of
          the SAM AI Technologies Web Development Internship.
        </p>
      </div>

      <div className="why-grid">
        <div className="why-card"><span>🇮🇳</span><h3>Made for India</h3><p>Indian brands, prices in ₹ and delivery across India.</p></div>
        <div className="why-card"><span>🚚</span><h3>Free Delivery</h3><p>No delivery charge on orders of ₹499 or more.</p></div>
        <div className="why-card"><span>🔒</span><h3>Safe Payments</h3><p>Every online payment is verified by our server.</p></div>
      </div>

      <div className="center-row">
        <Link to="/products" className="btn">Start Shopping</Link>
      </div>
    </div>
  );
}

export default About;
