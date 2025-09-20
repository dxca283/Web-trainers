const API_URL = "http://localhost:5500/api/v1/orders";


//Thanh toán
export const checkoutCart = async (token) => {
  const res = await fetch(`${API_URL}/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Không thể thanh toán");
  }

  return res.json();
};

export const cancelOrder = async (token, orderId) => {
  const res = await fetch(`${API_URL}/cancel/${orderId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Không thể hủy đơn");
  }

  return res.json();
};
export const getOrderById = async (token, id) => {
  const res = await fetch(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch order");
  }

  return res.json();
};

export const getOrders = async (token, status) => {
  try {
    const url = new URL(API_URL);
    if (status) {
      url.searchParams.append("status", status); // thêm status vào query nếu có
    }

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to fetch orders");
    }

    return await res.json();
  } catch (error) {
    console.error("getOrders error:", error);
    throw error;
  }
};