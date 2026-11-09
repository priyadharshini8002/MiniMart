// pages/Payment.jsx
// Step 2: choose Cash on Delivery or Razorpay and place the order.
//
// COD:       POST /api/orders
// Razorpay:  POST /api/payment/create-order -> Razorpay popup -> POST /api/payment/verify
//            (the backend creates the order only AFTER it verifies the payment signature)

import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { getErrorMessage } from "../services/api";
import { loadRazorpayScript } from "../services/razorpay";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { formatPrice } from "../utils/format";
import OrderSummary from "../components/OrderSummary";
import Loader from "../components/Loader";

function Payment() {
  const { user } = useAuth();
  const { items, loading, total, refreshCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [method, setMethod] = useState("COD");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const orderPlaced = useRef(false);

  // Delivery details saved on the Checkout page
  const shipping = JSON.parse(sessionStorage.getItem("minimart_shipping") || "null");

  useEffect(() => {
    if (loading || orderPlaced.current) return;
    if (items.length === 0) navigate("/cart", { replace: true });
    else if (!shipping) navigate("/checkout", { replace: true });
  }, [loading, items, shipping, navigate]);

  // Called when an order has been placed successfully
  const finishOrder = async (order) => {
    orderPlaced.current = true; // stops the "empty cart" redirect below
    sessionStorage.removeItem("minimart_shipping");
    await refreshCart(); // the backend has emptied the cart
    showToast("Order placed successfully!");
    navigate(`/order-confirmation/${order._id}`, { replace: true });
  };

  const placeCodOrder = async () => {
    const { data } = await api.post("/orders", {
      shippingAddress: shipping,
      paymentMethod: "COD",
    });
    await finishOrder(data.order);
  };

  const payWithRazorpay = async () => {
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      setError("Could not load Razorpay. Check your internet connection.");
      setProcessing(false);
      return;
    }

    // 1. Backend creates a Razorpay order with the amount from the database
    const { data } = await api.post("/payment/create-order");

    // 2. Open the Razorpay payment popup
    const options = {
      key: data.keyId, // public key only
      amount: data.amount,
      currency: data.currency,
      name: "MiniMart",
      description: "MiniMart order payment",
      order_id: data.razorpayOrderId,
      prefill: { name: shipping.fullName, email: shipping.email, contact: shipping.phone },
      theme: { color: "#5D4037" },

      // 3. After payment, send the result to OUR backend to verify the signature
      handler: async (response) => {
        try {
          const verify = await api.post("/payment/verify", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            shippingAddress: shipping,
          });
          await finishOrder(verify.data.order);
        } catch (err) {
          setError(getErrorMessage(err));
          setProcessing(false);
        }
      },

      modal: {
        ondismiss: () => {
          setProcessing(false);
          setError("Payment was cancelled. You have not been charged.");
        },
      },
    };

    const popup = new window.Razorpay(options);
    popup.on("payment.failed", () => {
      setProcessing(false);
      setError("Payment failed. Please try again or choose Cash on Delivery.");
    });
    popup.open();
  };

  const handlePlaceOrder = async () => {
    setError("");
    setProcessing(true);
    try {
      if (method === "COD") await placeCodOrder();
      else await payWithRazorpay();
    } catch (err) {
      setError(getErrorMessage(err));
      setProcessing(false);
    }
  };

  if (loading || !shipping) return <Loader />;

  return (
    <div className="page">
      <h1 className="page-title">Payment</h1>
      <p className="steps"><span>1. Delivery Details</span> → 2. Payment → <span>3. Confirmation</span></p>

      <div className="cart-layout">
        <div>
          <div className="form-card">
            <h3>Delivering to</h3>
            <p>
              <strong>{shipping.fullName}</strong> · +91 {shipping.phone}
              <br />
              {shipping.address}, {shipping.street}
              <br />
              {shipping.city}, {shipping.state} - {shipping.pincode}
            </p>
            <Link to="/checkout" className="continue-link">Change address</Link>
          </div>

          <div className="form-card">
            <h3>Choose Payment Method</h3>

            {error && <p className="error-box">{error}</p>}

            <label className={`pay-option ${method === "COD" ? "selected" : ""}`}>
              <input type="radio" name="method" checked={method === "COD"} onChange={() => setMethod("COD")} />
              <div>
                <strong>Cash on Delivery</strong>
                <p>Pay in cash when your order arrives.</p>
              </div>
            </label>

            <label className={`pay-option ${method === "Razorpay" ? "selected" : ""}`}>
              <input type="radio" name="method" checked={method === "Razorpay"} onChange={() => setMethod("Razorpay")} />
              <div>
                <strong>Pay Online (Razorpay)</strong>
                <p>UPI, cards, net banking and wallets. Test mode only.</p>
              </div>
            </label>

            <button className="btn btn-block" onClick={handlePlaceOrder} disabled={processing}>
              {processing
                ? "Please wait..."
                : method === "COD"
                ? `Place Order - ${formatPrice(total)}`
                : `Pay ${formatPrice(total)}`}
            </button>
            <p className="tax-note">Logged in as {user.email}</p>
          </div>
        </div>

        <OrderSummary showItems />
      </div>
    </div>
  );
}

export default Payment;
