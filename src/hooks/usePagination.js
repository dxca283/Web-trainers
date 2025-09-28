import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts } from "../services/prodApi.js";

export const usePagination = (fetchFunction, defaultLimit = 12) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = parseInt(searchParams.get("page") || "1", 10);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(pageParam);

  const filtersRef = useRef({});

  const fetchPage = async (page = 1, extraParams = undefined) => {
    setLoading(true);
    try {
      const params = extraParams ?? filtersRef.current ?? {};
      const hasFilter = Object.values(params).some(
        (v) => v !== "" && v !== null && v !== undefined
      );

      const res = hasFilter
        ? await fetchFunction({ page, limit: defaultLimit, ...params })
        : await getProducts({ page, limit: defaultLimit });

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

  const resetPage = (extraParams = {}) => {
    filtersRef.current = extraParams || {};
    setCurrentPage(1);
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };


  useEffect(() => {
    const newParams = new URLSearchParams();


    Object.entries(filtersRef.current || {}).forEach(([k, v]) => {
      if (v !== "" && v !== null && v !== undefined) {
        newParams.set(k, String(v));
      }
    });

    newParams.set("page", String(currentPage));
    setSearchParams(newParams);


    fetchPage(currentPage, filtersRef.current);

  }, [currentPage]); 

  useEffect(() => {

    const urlFilters = Object.fromEntries(
      [...searchParams.entries()].filter(([k]) => k !== "page")
    );


    const urlFiltersStr = JSON.stringify(urlFilters || {});
    const currentFiltersStr = JSON.stringify(filtersRef.current || {});
    if (urlFiltersStr !== currentFiltersStr) {
      filtersRef.current = urlFilters;
    }

    const urlPage = parseInt(searchParams.get("page") || "1", 10);
    if (urlPage !== currentPage) {
      setCurrentPage(urlPage);
    }

  }, [searchParams]);

  return {
    data,
    loading,
    totalPages,
    currentPage,
    goToPage,
    resetPage,
  };
};
