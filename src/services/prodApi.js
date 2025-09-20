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

// Tìm kiếm sản phẩm với các tham số
export const searchProducts = async ({ query, minPrice, maxPrice, category, size }) => {
  const params = new URLSearchParams();
  if (query) params.append("q", query);
  if (minPrice) params.append("minPrice", minPrice);
  if (maxPrice) params.append("maxPrice", maxPrice);
  if (category) params.append("category", category);
  if (size) params.append("size", size);

  const res = await fetch(`${API_URL}/search?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch products");

  return res.json();
};

// Lấy danh sách nhãn size
export const getSizeLabels = async () => {
  try {
    const res = await fetch(`${API_URL}/sizes/sizes-label`);
    if (!res.ok) throw new Error("Failed to fetch size labels");
    return await res.json(); 
  } catch (err) {
    console.error("Error fetching size labels:", err);
    throw err;
  }
};