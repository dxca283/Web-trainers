// services/prodApi.js
const API_URL = "http://localhost:5500/api/v1/products";

// Lấy tất cả sản phẩm
export const getProducts = async () => {
   const token = localStorage.getItem("token");
  try {
    const res = await fetch("http://localhost:5500/api/v1/products", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`, 
    },
  });
    if (!res.ok) throw new Error("Failed to fetch products");
    return await res.json();
  } catch (err) {
    console.error("Error fetching products:", err);
    throw err;
  }
};

// Lấy sản phẩm theo ID 
export const getProductById = async (id) => {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error("Failed to fetch product by ID");
    return await res.json();
  } catch (err) {
    console.error(`Error fetching product ${id}:`, err);
    throw err;
  }
};

// Lấy products theo category
export const getProductsByCategory = async (category_id) => {
  try {
    const res = await fetch(`${API_URL}/category/${category_id}`);
    if (!res.ok) {
      if (res.status === 404) {
        return [];
      }
      throw new Error("Failed to fetch products by category");
    }
    const data = await res.json();
    return data; 
  } catch (err) {
    console.error(`Error fetching products by category ${category_id}:`, err);
    throw err;
  }
};

