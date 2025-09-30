import React, { useState } from "react";
import { usePagination } from "../hooks/usePagination.js";
import ProductCard from "../components/ProductCard";
import FilterBar from "../components/FilterBar.jsx";
import { getProducts, searchProducts } from "../services/prodApi.js";
import { useDebounce } from "react-use";
import { updateSearchCount } from "../services/appwrite.js";
import HotProducts from "../components/HotProducts.jsx";
import useHotProducts from "../hooks/useHotProducts.js";
import Spinner from "../components/Spinner.jsx";

const ProductsPage = () => {
  const [hotProducts] = useHotProducts();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [size, setSize] = useState("");

  const {
    data: products,
    loading,
    totalPages,
    currentPage,
    goToPage,
    resetPage,
  } = usePagination(async ({ page, limit }) => {
    if (query || category || minPrice || maxPrice || size) {
      const params = {
        page,
        limit,
        q: query.trim(),
        category,
        minPrice,
        maxPrice,
        size,
      };
      const res = await searchProducts(params);
      if (query.trim() !== "" || category || minPrice || maxPrice || size) {
        res.results?.forEach((p) =>
          updateSearchCount(query.trim(), p).catch(console.error)
        );
      }

      return res;
    } else {
      const res_1 = await getProducts({ page, limit });
      return {
        results: res_1.results.map((p_1) => ({
          ...p_1,
          thumbnail: p_1.product_images?.[0]?.image_url || "/placeholder.png",
          sizes:
            p_1.product_sizes
              ?.map((ps) => ps.sizes?.size_label)
              .filter(Boolean) || [],
        })),
        totalPages: res_1.totalPages,
      };
    }
  });

  useDebounce(
    () => {
      if (
        query.trim() === "" &&
        category === "" &&
        minPrice === "" &&
        maxPrice === "" &&
        size === ""
      ) {
        resetPage(); // chỉ gọi getProducts, không gọi searchProducts
        return;
      }

      resetPage({ q: query.trim(), category, minPrice, maxPrice, size });
    },
    600,
    [query, category, minPrice, maxPrice, size]
  );

  const resetFilters = () => {
    setQuery("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSize("");
    resetPage();
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl text-gradient font-bold mb-8">
        Sản phẩm tìm kiếm nhiều nhất
      </h1>
      <HotProducts hotProducts={hotProducts} />

      <h1 className="text-3xl text-gradient font-bold mb-8">Tất cả sản phẩm</h1>
      <FilterBar
        query={query}
        setQuery={setQuery}
        category={category}
        setCategory={setCategory}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        size={size}
        setSize={setSize}
        onReset={resetFilters}
      />

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner  />
          <p className="text-gray-500 mt-2">Đang tải sản phẩm...</p>
        </div>
      ) : products.length === 0 ? (
        <p className="text-gradient">Chưa có sản phẩm nào.</p>
      ) : (
        <>
          <div className="all-products">
            <ul>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </ul>
          </div>

          <div className="pagination flex justify-center gap-2 mt-6">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`px-3 py-1 border rounded ${
                  currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-white"
                }`}
                onClick={() => goToPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductsPage;
