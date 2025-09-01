import { FaSearch, FaHeart, FaShoppingBag } from "react-icons/fa";

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
          <nav className="flex flex-wrap justify-center space-x-4 font-semibold">
            <a href="/" className="hover:text-white">
              Tất cả sản phẩm
            </a>

            {/* Sneakers với hover dropdown bằng Tailwind */}
            <div className="relative group inline-block">
              <button className="hover:text-white font-semibold">
                Sneakers
              </button>

              <ul className="absolute top-full left-0 bg-gray-800 text-gray-200 rounded-md shadow-lg w-40 opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-opacity duration-200">
                <li>
                  <a
                    href="/category/nike"
                    className="block px-4 py-2 hover:bg-gray-700"
                  >
                    Nike
                  </a>
                </li>
                <li>
                  <a
                    href="/category/adidas"
                    className="block px-4 py-2 hover:bg-gray-700"
                  >
                    Adidas
                  </a>
                </li>
                <li>
                  <a
                    href="/category/puma"
                    className="block px-4 py-2 hover:bg-gray-700"
                  >
                    Puma
                  </a>
                </li>
                <li>
                  <a
                    href="/category/vans"
                    className="block px-4 py-2 hover:bg-gray-700"
                  >
                    Vans
                  </a>
                </li>
                <li>
                  <a
                    href="/category/domba"
                    className="block px-4 py-2 hover:bg-gray-700"
                  >
                    Domba
                  </a>
                </li>
              </ul>
            </div>
          </nav>

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
