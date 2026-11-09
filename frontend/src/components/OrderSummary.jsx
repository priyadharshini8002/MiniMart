// components/OrderSummary.jsx
// The price box: items, subtotal, delivery and final amount.
// Used on the Cart, Checkout and Payment pages.

import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/format";
import { FREE_DELIVERY_ABOVE } from "../utils/constants";

function OrderSummary({ showItems = false, children }) {
  const { items, subtotal, deliveryCharge, total } = useCart();

  return (
    <aside className="summary-box">
      <h3>Order Summary</h3>

      {showItems && (
        <ul className="summary-items">
          {items.map((item) => (
            <li key={item.product._id}>
              <span>
                {item.product.name} × {item.quantity}
              </span>
              <span>{formatPrice(item.product.discountPrice * item.quantity)}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="summary-row">
        <span>Subtotal</span>
        <span>{formatPrice(subtotal)}</span>
      </div>
      <div className="summary-row">
        <span>Delivery Charges</span>
        <span>{deliveryCharge === 0 ? "FREE" : formatPrice(deliveryCharge)}</span>
      </div>
      {deliveryCharge > 0 && (
        <p className="summary-note">
          Add items worth {formatPrice(FREE_DELIVERY_ABOVE - subtotal)} more for free delivery.
        </p>
      )}
      <div className="summary-row summary-total">
        <span>Final Amount</span>
        <span>{formatPrice(total)}</span>
      </div>

      {children}
    </aside>
  );
}

export default OrderSummary;
