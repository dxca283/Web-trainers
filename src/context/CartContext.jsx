import { createContext, useState, useEffect } from "react";
import { getCart, updateCartItem, deleteCartItem } from "../services/cartApi.js";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await getCart();
        setCart(data);
      } catch (err) {
        console.error("Lỗi tải giỏ hàng:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const updateQuantity = async (itemId, newQty) => {
    if (newQty < 1) return;
    const item = cart.find((c) => c.id === itemId);
    try {
      const updated = await updateCartItem(itemId, { ...item, quantity: newQty });
      setCart((prev) =>
        prev.map((c) => (c.id === itemId ? updated : c))
      );
    } catch (err) {
      console.error("Lỗi cập nhật:", err);
    }
  };

  const removeItem = async (itemId) => {
    try {
      await deleteCartItem(itemId);
      setCart((prev) => prev.filter((c) => c.id !== itemId));
    } catch (err) {
      console.error("Lỗi xóa:", err);
    }
  };

  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider value={{ cart, loading, updateQuantity, removeItem, total }}>
      {children}
    </CartContext.Provider>
  );
};
