import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { useDebounce } from "react-use";
import { searchProducts } from "../services/prodApi.js";

const SearchBarNavbar = ({ onSearch, onSubmitSearch }) => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useDebounce(() => setDebouncedQuery(query), 400, [query]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedQuery.trim()) {
        onSearch?.([]);
        return;
      }
      try {
        const res = await searchProducts({ query: debouncedQuery });
        onSearch?.(res.results);
      } catch (err) {
        console.error("Search error:", err);
      }
    };
    fetchResults();
  }, [debouncedQuery]);

  const handleChange = (e) => setQuery(e.target.value);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSubmitSearch?.(query);
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Tìm kiếm..."
        className="pl-8 pr-3 py-1 rounded-md text-gray-200 bg-dark-100 border border-gray-600"
      />
      <FaSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
    </div>
  );
};

export default SearchBarNavbar;
