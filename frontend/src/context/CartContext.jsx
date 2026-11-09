// context/CartContext.jsx
// Keeps the shopping cart. For logged-in users the cart lives in MongoDB;
// this file loads it and gives simple functions to change it.
//
// Every function returns { ok: true } or { ok: false, message } so pages can show a message.

import { createContext, useContext, useEffect, useState } from "react";
import api, { getErrorMessage } from "../services/api";
import { useAuth } from "./AuthContext";
import { FREE_DELIVERY_ABOVE, DELIVERY_CHARGE } from "../utils/constants";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]); // [{ product, quantity }]
  const [loading, setLoading] = useState(false);

  // Load the cart when a user logs in, empty it when they log out
  useEffect(() => {
    if (!user) {
      setItems([]);
      return;
    }
    const loadCart = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/cart");
        setItems(data.items);
      } catch (error) {
        setItems([]);
      }
      setLoading(false);
    };
    loadCart();
  }, [user]);

  // Runs an API call that returns the updated cart
  const runCartRequest = async (request) => {
    try {
      const { data } = await request();
      setItems(data.items);
      return { ok: true };
    } catch (error) {
      return { ok: false, message: getErrorMessage(error) };
    }
  };

  const addToCart = (productId, quantity = 1) =>
    runCartRequest(() => api.post("/cart", { productId, quantity }));

  const updateQuantity = (productId, quantity) =>
    runCartRequest(() => api.put(`/cart/${productId}`, { quantity }));

  const removeFromCart = (productId) => runCartRequest(() => api.delete(`/cart/${productId}`));

  // Reload from the server (used after an order is placed)
  const refreshCart = async () => {
    try {
      const { data } = await api.get("/cart");
      setItems(data.items);
    } catch (error) {
      setItems([]);
    }
  };

  // Totals (for display only - the backend recalculates them)
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.product.discountPrice * i.quantity, 0);
  const deliveryCharge = subtotal === 0 || subtotal >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_CHARGE;
  const total = subtotal + deliveryCharge;

  return (
    <CartContext.Provider
      value={{
        items, loading, itemCount, subtotal, deliveryCharge, total,
        addToCart, updateQuantity, removeFromCart, refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
