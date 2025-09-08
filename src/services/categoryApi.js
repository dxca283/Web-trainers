// src/services/categoryApi.js
const API_URL = "http://localhost:5500/api/v1";

// Lấy tất cả categories
export const getCategories = async () => {
  try {
    const res = await fetch(`${API_URL}/categories`);
    if (!res.ok) throw new Error("Failed to fetch categories");
    return await res.json();
  } catch (err) {
    console.error("Error fetching categories:", err);
    throw err;
  }
};

// Lấy category theo id
export const getCategoryById = async (cat_id) => {
  try {
    const res = await fetch(`${API_URL}/categories/${cat_id}`);
    if (!res.ok) throw new Error("Failed to fetch category by id");
    return await res.json();
  } catch (err) {
    console.error(`Error fetching category ${cat_id}:`, err);
    throw err;
  }
};


