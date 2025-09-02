import { FaSearch, FaHeart, FaShoppingBag } from "react-icons/fa";
import CategoriesMenu from '../components/CategoriesMenu'

const Navbar = () => {
  return (
    <header className="w-full">
      {/* Top bar */}
      <div className="flex justify-between items-center px-6 py-3 bg-gray-900 text-gray-300 text-sm">
        {/* Left logo */}
        <a href="/" className="flex items-center">
          <img
            src="/jordan-logo.png"
            alt="Jordan Logo"
            className="h-6 filter invert brightness-125"
          />
        </a>

        {/* Right links: Đăng nhập, Đăng ký, Giỏ hàng */}
        <div className="flex space-x-4 items-center">
          <a href="/login" className="hover:text-white">
            Đăng nhập
          </a>
          <a href="/register" className="hover:text-white">
            Đăng ký
          </a>
          <a
            href="/cart"
            className="relative flex items-center hover:text-white"
          >
            {/* Badge số lượng */}
            <span className="absolute -top-2 bg-red-600 text-white text-xs w-5 h-4 flex items-center justify-center rounded-full">
              4
            </span>
            <img
              src="/cart-icon.png"
              alt="cart-icon"
              className="h-4 w-4 mr-1"
            />
            Giỏ hàng
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-gray-800 text-gray-300 px-6 py-4 relative">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Logo */}
          <a href="/" className="flex items-center mb-2 md:mb-0">
            <img
              src="/nike-logo.png"
              alt="Nike Logo"
              className="h-10 md:h-12 filter invert brightness-125"
            />
          </a>

          {/* Navigation / Categories */}
          <CategoriesMenu />

          {/* Icons + Search */}
          <div className="flex items-center space-x-4">
            {/* Search input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="pl-8 pr-3 py-1 rounded-md text-white-700"
              />
              <FaSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white-500" />
            </div>

            {/* Icons */}
            <FaHeart className="text-xl hover:text-white cursor-pointer" />
            <FaShoppingBag className="text-xl hover:text-white cursor-pointer" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
