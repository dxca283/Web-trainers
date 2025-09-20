import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { getProducts, searchProducts } from "../services/prodApi.js";
import FilterBar from "../components/FilterBar.jsx";
import { useDebounce } from "react-use";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [size, setSize] = useState("");

  useEffect(() => {
    const fetchProds = async () => {
      try {
        const data = await getProducts();
        setProducts(data || []);
      } catch (error) {
        console.error("Error fetching products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProds();
  }, []);

  // Filter/search products với debounce
  useDebounce(
    () => {
      const fetchFiltered = async () => {
        if (!query && !category && !minPrice && !maxPrice && !size) {
          setFilteredProducts([]);
          return;
        }
        try {
          const res = await searchProducts({
            query,
            category,
            minPrice,
            maxPrice,
            size,
          });
          setFilteredProducts(res.results || []);
        } catch (err) {
          console.error(err);
        }
      };
      fetchFiltered();
    },
    600,
    [query, category, minPrice, maxPrice, size]
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Đang tải sản phẩm...</p>
      </div>
    );
  }
  const displayProducts =
    filteredProducts.length > 0 || query || minPrice || maxPrice
      ? filteredProducts
      : products.map((p) => ({
          ...p,
          thumbnail: p.product_images?.[0]?.image_url || "/placeholder.png",
          sizes:
            p.product_sizes
              ?.map((ps) => ps.sizes?.size_label)
              .filter(Boolean) || [],
        }));

  const resetFilters = () => {
    setQuery("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSize("");
    setFilteredProducts([]);
  };
  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl text-gradient font-bold mb-8">Tất cả sản phẩm</h1>

      {/* Filter/Search bar */}
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

      {displayProducts.length === 0 ? (
        <p className="text-gradient">Chưa có sản phẩm nào.</p>
      ) : (
        <div className="all-products">
          <ul>
            {displayProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
