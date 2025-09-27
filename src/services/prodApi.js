// services/prodApi.js
import API_URL from "../../config/config.js";
import { handleResponse } from "./apiHelper.js";

const PRODUCT_URL = `${API_URL}/api/v1/products`;

// Lấy tất cả sản phẩm
// services/prodApi.js

export const getProducts = async ({ page = 1, limit = 12 } = {}) => {
  try {
    const params = new URLSearchParams({ page, limit }).toString();
    const res = await fetch(`${PRODUCT_URL}/?${params}`);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    return data; // { results, total, page, totalPages }
  } catch (error) {
    console.error("Error fetching paginated products:", error);
    throw error;
  }
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

export const searchProducts = async ({ q, minPrice, maxPrice, category, size, page, limit, all = false }) => {
  const params = new URLSearchParams();
  if (q) params.append("q", q);
  if (minPrice) params.append("minPrice", minPrice);
  if (maxPrice) params.append("maxPrice", maxPrice);
  if (category) params.append("category", category);
  if (size) params.append("size", size);

  if (!all) {
    if (page) params.append("page", page);
    if (limit) params.append("limit", limit);
  }

  const res = await fetch(`${PRODUCT_URL}/search?${params.toString()}`);
  return handleResponse(res);
};

export const searchProductNoPagination = async ({ query, minPrice, maxPrice, category, size }) => {
  const params = new URLSearchParams();
  if (query) params.append("q", query);
  if (minPrice) params.append("minPrice", minPrice);
  if (maxPrice) params.append("maxPrice", maxPrice);
  if (category) params.append("category", category);
  if (size) params.append("size", size);

  const res = await fetch(`${PRODUCT_URL}/search-navbar?${params.toString()}`);
  return handleResponse(res);
};

// Lấy danh sách nhãn size
export const getSizeLabels = async () => {
  const res = await fetch(`${PRODUCT_URL}/sizes/sizes-label`);
  return handleResponse(res);
};
