import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../services/categoryApi.js";

export default function CategoriesMenu() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    fetchData();
  }, []);

  return (
    <nav className="flex flex-wrap justify-center space-x-4 font-semibold">
      <Link to="/products" className="hover:text-white">
        Tất cả sản phẩm
      </Link>

      {/* Drop down menu categories */}
      <div className="relative group inline-block z-50">
        <button className="hover:text-white font-semibold">Sneakers</button>

        <ul className="absolute top-full left-0 bg-gray-800 text-gray-200 rounded-md shadow-lg w-40 opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-opacity duration-200 z-50">
          {categories.map((cat) => (
            <li key={cat.id}>
              <Link
                to={`/categories/${cat.id}`}
                className="block px-4 py-2 hover:bg-gray-700"
              >
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
