// services/prodApi.js
import API_URL from "../../config/config.js";
import { handleResponse } from "./apiHelper.js";

const PRODUCT_URL = `${API_URL}/api/v1/products`;

// Lấy tất cả sản phẩm
export const getProducts = async (token) => {
  const res = await fetch(PRODUCT_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(res);
};

// Lấy sản phẩm theo ID
export const getProductById = async (id) => {
  const res = await fetch(`${PRODUCT_URL}/${id}`);
  return handleResponse(res);
};

// Lấy sản phẩm theo category
export const getProductsByCategory = async (category_id) => {
  const res = await fetch(`${PRODUCT_URL}/category/${category_id}`);
  if (res.status === 404) return [];
  return handleResponse(res);
};

// Tìm kiếm sản phẩm với filter
export const searchProducts = async ({ query, minPrice, maxPrice, category, size }) => {
  const params = new URLSearchParams();
  if (query) params.append("q", query);
  if (minPrice) params.append("minPrice", minPrice);
  if (maxPrice) params.append("maxPrice", maxPrice);
  if (category) params.append("category", category);
  if (size) params.append("size", size);

  const res = await fetch(`${PRODUCT_URL}/search?${params.toString()}`);
  return handleResponse(res);
};

// Lấy danh sách nhãn size
export const getSizeLabels = async () => {
  const res = await fetch(`${PRODUCT_URL}/sizes/sizes-label`);
  return handleResponse(res);
};
