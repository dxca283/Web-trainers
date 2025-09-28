import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts } from "../services/prodApi.js";

export const usePagination = (fetchFunction, defaultLimit = 12) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = parseInt(searchParams.get("page") || "1");

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(pageParam);

  const isMounted = useRef(false); 

  const fetchPage = async (page = 1, extraParams = {}) => {
    setLoading(true);
    try {
      const hasFilter = Object.values(extraParams).some(v => v !== "" && v !== null);
      const res = hasFilter
        ? await fetchFunction({ page, limit: defaultLimit, ...extraParams })
        : await getProducts({ page, limit: defaultLimit }); // sản phẩm mặc định
      setData(res.results || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error("Pagination fetch error:", err);
      setData([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // Reset page về 1 và fetch luôn
  const resetPage = (extraParams = {}) => {
    setCurrentPage(1);
    fetchPage(1, extraParams);
  };

  // Khi currentPage thay đổi do user click pagination
  useEffect(() => {
    // Sync URL nhưng không fetch thêm
    setSearchParams({ ...Object.fromEntries(searchParams), page: currentPage });

    // Chỉ fetch nếu component đã mount
    if (isMounted.current) {
      fetchPage(currentPage);
    } else {
      isMounted.current = true; // đánh dấu đã mount
    }
  }, [currentPage]);

  // Sync page state với URL (back/forward browser)
  useEffect(() => {
    if (pageParam !== currentPage) setCurrentPage(pageParam);
  }, [pageParam]);

  const goToPage = (page) => setCurrentPage(page);

  return { data, loading, totalPages, currentPage, goToPage, resetPage };
};
