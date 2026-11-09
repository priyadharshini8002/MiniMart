// components/Footer.jsx
// The footer shown on every page.

import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <h3>🛍️ MiniMart</h3>
          <p>
            MiniMart is a simple Indian online store for fashion, electronics, home needs and
            groceries. Online shopping made easy.
          </p>
        </div>

        <div>
          <h4>Useful Links</h4>
          <Link to="/products">Products</Link>
          <Link to="/categories">Categories</Link>
          <Link to="/cart">My Cart</Link>
          <Link to="/my-orders">My Orders</Link>
          <Link to="/about">About Us</Link>
        </div>

        <div>
          <h4>Contact Information</h4>
          <p>📍 12, Gandhi Road, Chennai, Tamil Nadu - 600001</p>
          <p>📞 +91 98765 43210</p>
          <p>✉️ support@minimart.in</p>
        </div>

        <div>
          <h4>Policies</h4>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms">Terms and Conditions</Link>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} MiniMart. Made for SAM AI Technologies Internship Task 5.
      </div>
    </footer>
  );
}

export default Footer;
