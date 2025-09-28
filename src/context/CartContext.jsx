import { createContext, useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import {
  getCart,
  updateCartItem,
  deleteCartItem,
  addToCart,
} from "../services/cartApi.js";
import { checkoutCart } from "../services/orderApi.js";
import AuthContext from "./AuthContext.jsx";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { token, logout } = useContext(AuthContext); // lấy logout từ AuthContext
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCheckout, setLoadingCheckout] = useState(false);

  const handleAuthError = (err) => {
    if (!token) {
      toast.warn("Bạn cần đăng nhập để thực hiện thao tác này");
      return;
    }

    if (err?.response?.status === 401) {
      toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
      logout();
      return;
    }

    const msg =
      err?.response?.data?.message ||
      err?.message ||
      "Đã xảy ra lỗi không xác định";
    toast.error(msg);
  };

  const fetchCart = async () => {
    try {
      const data = await getCart(token);
      setCart(data.cart);
    } catch (err) {
      handleAuthError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchCart();
  }, [token]);

  const addItem = async (item) => {
    try {
      const data = await addToCart(token, item);
      await fetchCart();
      return data;
    } catch (err) {
      handleAuthError(err);
      throw err;
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      await updateCartItem(token, itemId, { quantity });
      setCart((prev) =>
        prev.map((c) => (c.id === itemId ? { ...c, quantity } : c))
      );
    } catch (err) {
      handleAuthError(err);
    }
  };

  const removeItem = async (itemId) => {
    try {
      await deleteCartItem(token, itemId);
      setCart((prev) => prev.filter((c) => c.id !== itemId));
    } catch (err) {
      handleAuthError(err);
    }
  };

  const total = cart.reduce(
    (sum, item) => sum + (item.price || 0) * item.quantity,
    0
  );

  const checkout = async () => {
    if (cart.length === 0) {
      toast.warn("Giỏ hàng trống");
      return;
    }
    try {
      setLoadingCheckout(true);
      const res = await checkoutCart(token);
      await fetchCart();
      toast.success("Xác nhận thành công");
      return res;
    } catch (err) {
      handleAuthError(err);
      throw err;
    } finally {
      setLoadingCheckout(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addItem,
        updateQuantity,
        removeItem,
        total,
        checkout,
        loadingCheckout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
