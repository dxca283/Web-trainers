import { FaSearch } from "react-icons/fa";

const SearchBar = ({ query, setQuery }) => {
  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      // có thể trigger fetch ngay nếu muốn, nhưng debounce ở cha đã đủ
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Tìm kiếm sản phẩm..."
        className="pl-8 pr-3 py-1 rounded-md text-gray-200 placeholder-light-200 bg-dark-100 border border-gray-600"
      />
      <FaSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
    </div>
  );
};

export default SearchBar;
