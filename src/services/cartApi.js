import { handleResponse } from "./apiHelper.js";

const API_URL = "http://localhost:5500/api/v1/cart";


// Lấy giỏ hàng
export const getCart = async (token) => {
  const res = await fetch(API_URL, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res);
};

// Cập nhật số lượng
export const updateCartItem = async (token, itemId, data) => {
  const res = await fetch(`${API_URL}/${itemId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};

// Xóa item
export const deleteCartItem = async (token, itemId) => {
  const res = await fetch(`${API_URL}/${itemId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res);
};

// Thêm vào giỏ hàng
export const addToCart = async (token, { product_id, size_id, quantity }) => {
  const res = await fetch(`${API_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ product_id, size_id, quantity }),
  });
  return handleResponse(res);
};
