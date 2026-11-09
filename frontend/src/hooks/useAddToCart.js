// hooks/useAddToCart.js
// One shared function for every "Add to Cart" button.
// If the user is not logged in, it sends them to the Login page first.

import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

export default function useAddToCart() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  return async (product, quantity = 1) => {
    if (!user) {
      showToast("Please login to add items to your cart", "error");
      navigate("/login", { state: { from: location } });
      return false;
    }

    const result = await addToCart(product._id, quantity);
    if (result.ok) showToast(`${product.name} added to cart`);
    else showToast(result.message, "error");
    return result.ok;
  };
}
