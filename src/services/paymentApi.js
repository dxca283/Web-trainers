// services/paymentApi.js
import API_URL from "../../config/config.js";
import { handleResponse } from "./apiHelper.js";

const PAYPAL_URL = `${API_URL}/api/v1/payments/paypal`;

// Gọi API tạo order PayPal (mapping với dbOrderId)
export const createPaypalOrder = async (token, dbOrderId, shippingFee = 0,shippingAddress ) => {
  const res = await fetch(`${PAYPAL_URL}/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ dbOrderId, shippingFee, shippingAddress }),
  });
  return handleResponse(res);
};

// Gọi API capture thanh toán sau khi user quay lại site
export const capturePaypalOrder = async (token, paypalOrderId, dbOrderId) => {
  const res = await fetch(`${PAYPAL_URL}/capture`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ paypalOrderId, dbOrderId }),
  });
  return handleResponse(res);
};




/*

export const createPaypalSession = async (token, orderIds, userId) => {
  const res = await fetch(`${API_URL}/paypal/session/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // có thể bỏ nếu không cần login
    },
    body: JSON.stringify({ orderIds, userId }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Không tạo được session");
  }

  return res.json();
};


export const capturePaypalSession = async (token, sessionId, paypalOrderId) => {
  const res = await fetch(`${API_URL}/paypal/session/capture`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ sessionId, paypalOrderId }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to capture PayPal session");
  }

  return res.json();
};


*/