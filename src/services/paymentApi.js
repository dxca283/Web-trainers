// services/paymentApi.js
const API_URL = "http://localhost:5500/api/v1/payments";

// Gọi API tạo order PayPal (mapping với dbOrderId)
export const createPaypalOrder = async (token, dbOrderId) => {
  const res = await fetch(`${API_URL}/paypal/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ dbOrderId }), 
  });

  if (!res.ok) throw new Error("Failed to create PayPal order");
  return res.json();
};

// Gọi API capture thanh toán sau khi user quay lại site
export const capturePaypalOrder = async (token, paypalOrderId, dbOrderId) => {
  const res = await fetch(`${API_URL}/paypal/capture`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ paypalOrderId, dbOrderId }),
  });

  if (!res.ok) throw new Error("Failed to capture PayPal order");
  return res.json();
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