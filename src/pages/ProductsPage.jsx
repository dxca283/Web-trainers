import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { getProducts, searchProducts } from "../services/prodApi.js";
import FilterBar from "../components/FilterBar.jsx";
import { useDebounce } from "react-use";
import { updateSearchCount } from "../services/appwrite.js";
import HotProducts from "../components/HotProducts.jsx";
import useHotProducts from "../hooks/useHotProducts.js";
import Spinner from "../components/Spinner.jsx"; // import spinner component

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [hotProducts] = useHotProducts();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false); // spinner cho search/filter

  // Filter states
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [size, setSize] = useState("");

  // Filter/search products với debounce
  useDebounce(
    () => {
      const fetchFiltered = async () => {
        const trimmedQuery = query.trim();

        if (!trimmedQuery && !category && !minPrice && !maxPrice && !size) {
          setFilteredProducts([]);
          return;
        }

        setSearching(true);
        try {
          const res = await searchProducts({
            query: trimmedQuery,
            category,
            minPrice,
            maxPrice,
            size,
          });

          const results = res.results || [];
          setFilteredProducts(results);

          
          results.forEach((product) => {
            updateSearchCount(trimmedQuery, product).catch((err) =>
              console.error("Appwrite updateSearchCount error:", err)
            );
          });
        } catch (err) {
          console.error(err);
        } finally {
          setSearching(false);
        }
      };
      fetchFiltered();
    },
    600,
    [query, category, minPrice, maxPrice, size]
  );

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

  const resetFilters = () => {
    setQuery("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSize("");
    setFilteredProducts([]);
  };

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

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner loading={true} />
        <p className="text-gray-500 mt-2">Đang tải sản phẩm...</p>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl text-gradient font-bold mb-8">
        Sản phẩm tìm kiếm nhiều nhất
      </h1>
      <HotProducts hotProducts={hotProducts} allProducts={products} />

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

      {searching ? (
        <div className="flex justify-center items-center h-64">
          <Spinner loading={true} />
          <p className="text-gray-500 mt-2">Đang tìm kiếm...</p>
        </div>
      ) : displayProducts.length === 0 ? (
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
