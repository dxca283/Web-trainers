import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10">
      <div className="w-full px-6 md:px-12 flex flex-col md:flex-row justify-between">
        
        {/* Logo + Thông tin */}
        <div className="mb-6 md:mb-0">
          <h1 className="text-2xl font-bold text-white mb-2">ShoeStore</h1>
          <p className="text-gray-400">
            Cung cấp giày chất lượng cao, phong cách đa dạng.
          </p>
        </div>

        {/* Liên kết nhanh */}
        <div className="mb-6 md:mb-0">
          <h2 className="text-lg font-semibold mb-2">Liên kết</h2>
          <ul>
            <li className="hover:text-white transition-colors">
              <Link to="/">Trang chủ</Link>
            </li>
            <li className="hover:text-white transition-colors">
              <Link to="/products">Sản phẩm</Link>
            </li>
            <li className="hover:text-white transition-colors">
              <Link to="/about">Về chúng tôi</Link>
            </li>
            <li className="hover:text-white transition-colors">
              <Link to="/contact">Liên hệ</Link>
            </li>
          </ul>
        </div>

        {/* Mạng xã hội */}
        <div className="mb-6 md:mb-0">
          <h2 className="text-lg font-semibold mb-2">Theo dõi chúng tôi</h2>
          <div className="flex space-x-4">
            <a href="https://facebook.com" target="_blank">Facebook</a>
            <a href="https://instagram.com" target="_blank">Instagram</a>
            <a href="https://twitter.com" target="_blank">Twitter</a>
          </div>
        </div>

        {/* Thông tin liên hệ */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Liên hệ</h2>
          <p>Email: support@shoestore.com</p>
          <p>Hotline: 0123 456 789</p>
        </div>

      </div>

      <div className="text-center text-gray-500 mt-8">
        &copy; {new Date().getFullYear()} ShoeStore. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
