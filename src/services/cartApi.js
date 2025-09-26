import { handleResponse } from "./apiHelper.js";
import API_URL from "../../config/config.js";

const CART_URL = `${API_URL}/api/v1/cart`;

// Lấy giỏ hàng
export const getCart = async (token) => {
  const res = await fetch(CART_URL, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res);
};

// Cập nhật số lượng sản phẩm trong giỏ
export const updateCartItem = async (token, itemId, data) => {
  const res = await fetch(`${CART_URL}/${itemId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};

// Xóa sản phẩm khỏi giỏ
export const deleteCartItem = async (token, itemId) => {
  const res = await fetch(`${CART_URL}/${itemId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res);
};

// Thêm sản phẩm vào giỏ
export const addToCart = async (token, { product_id, size_id, quantity }) => {
  const res = await fetch(CART_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ product_id, size_id, quantity }),
  });
  return handleResponse(res);
};
