// cartService.js
const API_URL = "http://localhost:5500/api/v1/cart";

// Lấy token từ localStorage (hoặc context)
const getToken = () => localStorage.getItem("token");

// Lấy giỏ hàng
export const getCart = async () => {
  const token = getToken();
  const res = await fetch(API_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch cart");
  }

  return res.json();
};

// Cập nhật số lượng
export const updateCartItem = async (itemId, data) => {
  const token = getToken();
  const res = await fetch(`${API_URL}/${itemId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, 
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update cart item");
  return res.json(); 
};


// Xóa item
export const deleteCartItem = async (itemId) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/${itemId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to delete cart item");
  return res.json(); 
};

