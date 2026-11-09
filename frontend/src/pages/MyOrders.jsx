// pages/MyOrders.jsx
// List of all orders placed by the logged-in user, newest first.

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { getErrorMessage } from "../services/api";
import { formatDate, formatPrice } from "../utils/format";
import Loader from "../components/Loader";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const { data } = await api.get("/orders/my-orders");
        setOrders(data.orders);
      } catch (err) {
        setError(getErrorMessage(err));
      }
      setLoading(false);
    };
    loadOrders();
  }, []);

  if (loading) return <Loader text="Loading your orders..." />;

  return (
    <div className="page">
      <h1 className="page-title">My Orders</h1>

      {error && <p className="error-box">{error}</p>}

      {!error && orders.length === 0 && (
        <div className="empty-box">
          <p>📦 You have not placed any orders yet.</p>
          <Link to="/products" className="btn">Start Shopping</Link>
        </div>
      )}

      {orders.map((order) => (
        <div className="order-card" key={order._id}>
          <div className="order-card-head">
            <div>
              <strong>Order {order.orderId}</strong>
              <p>{formatDate(order.createdAt)}</p>
            </div>
            <div className="order-card-right">
              <span className="status-pill">{order.orderStatus}</span>
              <strong>{formatPrice(order.totalAmount)}</strong>
            </div>
          </div>

          <div className="order-thumbs">
            {order.items.map((item) => (
              <div className="order-thumb" key={item.product || item.name}>
                <img src={item.image} alt={item.name} />
                <span>
                  {item.name} × {item.quantity}
                </span>
              </div>
            ))}
          </div>

          <div className="order-card-foot">
            <span>
              {order.paymentMethod === "COD" ? "Cash on Delivery" : "Razorpay"} · Payment {order.paymentStatus}
            </span>
            <Link to={`/order-confirmation/${order._id}`} className="btn btn-outline">View Details</Link>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MyOrders;
