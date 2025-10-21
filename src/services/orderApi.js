// src/services/orderApi.js
import API_URL from "../../config/config.js";
import { handleResponse } from "./apiHelper.js";

const ORDER_URL = `${API_URL}/api/v1/orders`;

// Thanh toán
export const checkoutCart = async (token) => {
  const res = await fetch(`${ORDER_URL}/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(res);
};

// Hủy đơn
export const cancelOrder = async (token, orderId) => {
  const res = await fetch(`${ORDER_URL}/cancel/${orderId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(res);
};

// Lấy đơn theo ID
export const getOrderById = async (token, id) => {
  const res = await fetch(`${ORDER_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res);
};

// Lấy tất cả đơn (có filter status nếu cần)
export const getOrders = async (token, status) => {
  const url = new URL(ORDER_URL);
  if (status) url.searchParams.append("status", status);

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return handleResponse(res);
};
