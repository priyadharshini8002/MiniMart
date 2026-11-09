// pages/OrderConfirmation.jsx
// Shown after an order is placed. Loads the real order from MongoDB.

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api, { getErrorMessage } from "../services/api";
import { formatDate, formatPrice } from "../utils/format";
import Loader from "../components/Loader";

function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data.order);
      } catch (err) {
        setError(getErrorMessage(err));
      }
    };
    loadOrder();
  }, [id]);

  if (error) {
    return (
      <div className="page">
        <p className="error-box">{error}</p>
        <Link to="/my-orders" className="btn">Go to My Orders</Link>
      </div>
    );
  }

  if (!order) return <Loader />;

  const a = order.shippingAddress;

  return (
    <div className="page">
      <div className="success-banner">
        <span>✅</span>
        <h1>Thank you! Your order is confirmed.</h1>
        <p>
          Order ID: <strong>{order.orderId}</strong>
        </p>
      </div>

      <div className="cart-layout">
        <div className="form-card">
          <h3>Items Ordered</h3>
          {order.items.map((item) => (
            <div className="order-item" key={item.product || item.name}>
              <img src={item.image} alt={item.name} />
              <div>
                <p className="product-name">{item.name}</p>
                <p>
                  {formatPrice(item.price)} × {item.quantity}
                </p>
              </div>
              <strong>{formatPrice(item.price * item.quantity)}</strong>
            </div>
          ))}
        </div>

        <aside className="summary-box">
          <h3>Order Details</h3>
          <div className="summary-row"><span>Order Date</span><span>{formatDate(order.createdAt)}</span></div>
          <div className="summary-row"><span>Order Status</span><span className="status-pill">{order.orderStatus}</span></div>
          <div className="summary-row">
            <span>Payment Method</span>
            <span>{order.paymentMethod === "COD" ? "Cash on Delivery" : "Razorpay (Online)"}</span>
          </div>
          <div className="summary-row"><span>Payment Status</span><span>{order.paymentStatus}</span></div>
          <hr />
          <div className="summary-row"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
          <div className="summary-row">
            <span>Delivery Charges</span>
            <span>{order.deliveryCharge === 0 ? "FREE" : formatPrice(order.deliveryCharge)}</span>
          </div>
          <div className="summary-row summary-total"><span>Total Amount</span><span>{formatPrice(order.totalAmount)}</span></div>
          <hr />
          <h4>Delivery Address</h4>
          <p>
            {a.fullName}, +91 {a.phone}
            <br />
            {a.address}, {a.street}, {a.city}, {a.state} - {a.pincode}
          </p>
          <Link to="/my-orders" className="btn btn-block">View My Orders</Link>
          <Link to="/products" className="continue-link">Continue Shopping</Link>
        </aside>
      </div>
    </div>
  );
}

export default OrderConfirmation;
