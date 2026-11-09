// pages/Cart.jsx
// Shopping cart: change quantity, remove items, see totals, go to checkout.

import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { formatPrice } from "../utils/format";
import OrderSummary from "../components/OrderSummary";
import Loader from "../components/Loader";

function Cart() {
  const { items, loading, updateQuantity, removeFromCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const changeQuantity = async (productId, newQuantity) => {
    const result = await updateQuantity(productId, newQuantity);
    if (!result.ok) showToast(result.message, "error");
  };

  const handleRemove = async (item) => {
    const result = await removeFromCart(item.product._id);
    if (result.ok) showToast(`${item.product.name} removed from cart`);
    else showToast(result.message, "error");
  };

  if (loading) return <Loader text="Loading your cart..." />;

  if (items.length === 0) {
    return (
      <div className="page">
        <div className="empty-box">
          <p>🛒 Your cart is empty.</p>
          <Link to="/products" className="btn">Start Shopping</Link>
        </div>
      </div>
    );
  }

  // If stock dropped below the quantity in the cart, checkout is blocked
  const hasStockProblem = items.some((i) => i.quantity > i.product.stock);

  return (
    <div className="page">
      <h1 className="page-title">Shopping Cart</h1>

      <div className="cart-layout">
        <div className="cart-items">
          {items.map((item) => (
            <div className="cart-item" key={item.product._id}>
              <Link to={`/products/${item.product._id}`}>
                <img src={item.product.image} alt={item.product.name} />
              </Link>

              <div className="cart-item-info">
                <Link to={`/products/${item.product._id}`} className="product-name">
                  {item.product.name}
                </Link>
                <p className="product-brand">{item.product.brand}</p>
                <p className="price-now">{formatPrice(item.product.discountPrice)}</p>
                {item.quantity > item.product.stock && (
                  <p className="field-error">Only {item.product.stock} in stock. Please reduce the quantity.</p>
                )}
              </div>

              <div className="cart-item-actions">
                <div className="qty-box">
                  <button
                    onClick={() => changeQuantity(item.product._id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => changeQuantity(item.product._id, item.quantity + 1)}
                    disabled={item.quantity >= item.product.stock}
                  >
                    +
                  </button>
                </div>
                <p className="line-total">{formatPrice(item.product.discountPrice * item.quantity)}</p>
                <button className="remove-button" onClick={() => handleRemove(item)}>Remove</button>
              </div>
            </div>
          ))}
        </div>

        <OrderSummary>
          <button
            className="btn btn-block"
            disabled={hasStockProblem}
            onClick={() => navigate("/checkout")}
          >
            Proceed to Checkout
          </button>
          <Link to="/products" className="continue-link">← Continue Shopping</Link>
        </OrderSummary>
      </div>
    </div>
  );
}

export default Cart;
