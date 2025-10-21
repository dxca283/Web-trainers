import { FaSearch, FaHeart, FaShoppingBag } from "react-icons/fa";
import CategoriesMenu from "../components/CategoriesMenu";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import CartContext from "../context/CartContext";
import AuthContext from "../context/AuthContext";
import UserMenu from "../components/UserMenu";
import SearchBarNav from "../components/SearchBarNav";

const Navbar = () => {
  const { cart } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  const handleSearch = (results) => {
    setSearchResults(results);
  };

  

  return (
    <header className="w-full">
      {/* Top bar */}
      <div className="flex justify-between items-center px-6 py-3 bg-gray-900 text-gray-300 text-sm">
        {/* Left logo */}
        <Link to="/" className="flex items-center">
          <img
            src="/jordan-logo.png"
            alt="Jordan Logo"
            className="h-6 filter invert brightness-125"
          />
        </Link>

        {/* Right links */}
        <div className="flex space-x-4 items-center">
          {user ? (
            <>
              <UserMenu user={user} logout={logout}/>
              <Link
                to="/cart"
                className="relative flex items-center hover:text-white"
              >
                <span className="absolute -top-2 bg-red-600 text-white text-xs w-5 h-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
                <img
                  src="/cart-icon.png"
                  alt="cart-icon"
                  className="h-4 w-4 mr-1"
                />
                Giỏ hàng
              </Link>
            </>
          ) : (
            <>
              <Link to="/sign-in" className="hover:text-white">
                Đăng nhập
              </Link>
              <Link to="/sign-up" className="hover:text-white">
                Đăng ký
              </Link>
              <Link
                to="/cart"
                className="relative flex items-center hover:text-white"
              >
                <span className="absolute -top-2 bg-red-600 text-white text-xs w-5 h-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
                <img
                  src="/cart-icon.png"
                  alt="cart-icon"
                  className="h-4 w-4 mr-1"
                />
                Giỏ hàng
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-gray-800 text-gray-300 px-6 py-4 relative">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Logo */}
          <Link to="/" className="flex items-center mb-2 md:mb-0">
            <img
              src="/nike-logo.png"
              alt="Nike Logo"
              className="h-10 md:h-12 filter invert brightness-125"
            />
          </Link>

          {/* Navigation / Categories */}
          <CategoriesMenu />

          {/* Search + Icons */}
          <div className="flex items-center space-x-4 relative">
            <SearchBarNav
              onSearch={handleSearch}
              
            />

            {/* Dropdown search suggestion */}
            {searchResults.length > 0 && (
              <div className="absolute top-10 left-0 bg-gray-800 text-gray-300 shadow-lg mt-2 w-72 max-h-72 overflow-y-auto z-50 rounded-md">
                {searchResults.map((p) => (
                  <Link
                    key={p.id}
                    to={`/ProductDetail/${p.id}`}
                    className="flex items-center px-3 py-2 hover:bg-gray-700 rounded"
                    onClick={() => setSearchResults([])}
                  >
                    {p.thumbnail && (
                      <img
                        src={p.thumbnail}
                        alt={p.name}
                        className="w-8 h-8 mr-2 object-cover rounded"
                      />
                    )}
                    <span>{p.name}</span>
                  </Link>
                ))}
              </div>
            )}
            {/* Icons */}
            <FaHeart
              className="text-xl hover:text-white cursor-pointer"
              onClick={() => navigate("/favorite-items")}
            />

            {/* Icons */}
            <FaShoppingBag
              className="text-xl hover:text-white cursor-pointer"
              onClick={() => navigate("/order-history")}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
