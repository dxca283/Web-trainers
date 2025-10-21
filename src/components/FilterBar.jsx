import React, { useEffect, useState } from "react";
import { getCategories } from "../services/categoryApi.js";
import { getSizeLabels } from "../services/prodApi.js";
import Button from "./Button.jsx";
import SearchBar from "./SearchBar.jsx";

const FilterBar = ({
  query,
  setQuery,
  category,
  setCategory,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  size,
  setSize,
  onReset,
}) => {
  const [categories, setCategories] = useState([]);
  const [sizes, setSizes] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    const fetchSizes = async () => {
      try {
        const data = await getSizeLabels();
        setSizes(data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSizes();
    fetchCategories();
  }, []);

  return (
    <div className="mb-6 flex flex-wrap gap-4 items-center">
      <SearchBar query={query} setQuery={setQuery} />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="px-3 py-2 rounded-md text-gray-200 bg-dark-100 border border-gray-600"
      >
        <option value="">Tất cả loại</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.name}>
            {cat.name}
          </option>
        ))}
      </select>

      <input
        type="number"
        min={0}
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
        placeholder="Giá từ"
        className="px-3 py-2 rounded-md w-24 text-gray-200 bg-dark-100 border border-gray-600"
      />

      <input
        type="number"
        min={0}
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
        placeholder="Giá đến"
        className="px-3 py-2 rounded-md w-24 text-gray-200 bg-dark-100 border border-gray-600"
      />

      <select
        value={size}
        onChange={(e) => setSize(e.target.value)}
        className="px-3 py-2 rounded-md text-gray-200 bg-dark-100 border border-gray-600"
      >
        <option value="">Tất cả size</option>
        {sizes.map((s) => (
          <option key={s.id} value={s.size_label}>
            {s.size_label}
          </option>
        ))}
      </select>

      <Button
        type="button"
        onClick={onReset}
        className="px-3 py-1 text-sm !w-auto"
      >
        Reset
      </Button>
    </div>
  );
};

export default FilterBar;
