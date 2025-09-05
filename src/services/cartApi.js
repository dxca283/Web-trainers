// cartService.js
const API_URL = "http://localhost:5000/cart";

// Lấy giỏ hàng
export const getCart = async () => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Failed to fetch cart");
  return res.json();
};

// Cập nhật số lượng
export const updateCartItem = async (itemId, updatedItem) => {
  const res = await fetch(`${API_URL}/${itemId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedItem),
  });
  if (!res.ok) throw new Error("Failed to update cart item");
  return res.json();
};

// Xóa item
export const deleteCartItem = async (itemId) => {
  const res = await fetch(`${API_URL}/${itemId}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete cart item");
  return true;
};
