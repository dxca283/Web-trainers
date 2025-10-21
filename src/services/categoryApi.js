// src/services/categoryApi.js
import API_URL from "../../config/config.js";
import { handleResponse } from "./apiHelper.js";

const CATEGORY_URL = `${API_URL}/api/v1/categories`;

// Lấy tất cả categories
export const getCategories = async () => {
  const res = await fetch(CATEGORY_URL, {
    method: "GET",
  });
  return handleResponse(res);
};

// Lấy category theo id
export const getCategoryById = async (cat_id) => {
  const res = await fetch(`${CATEGORY_URL}/${cat_id}`, {
    method: "GET",
  });
  return handleResponse(res);
};
