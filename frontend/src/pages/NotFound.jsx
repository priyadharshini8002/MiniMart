// pages/NotFound.jsx
// Shown for any address that does not exist.

import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="page">
      <div className="empty-box">
        <h1>404</h1>
        <p>Sorry, this page does not exist.</p>
        <Link to="/" className="btn">Go to Home</Link>
      </div>
    </div>
  );
}

export default NotFound;
