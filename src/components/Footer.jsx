import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10">
      <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between">
        
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
            <li className="hover:text-white transition-colors"><a href="/">Trang chủ</a></li>
            <li className="hover:text-white transition-colors"><a href="/shop">Sản phẩm</a></li>
            <li className="hover:text-white transition-colors"><a href="/about">Về chúng tôi</a></li>
            <li className="hover:text-white transition-colors"><a href="/contact">Liên hệ</a></li>
          </ul>
        </div>

        {/* Mạng xã hội */}
        <div className="mb-6 md:mb-0">
          <h2 className="text-lg font-semibold mb-2">Theo dõi chúng tôi</h2>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-white transition-colors">Facebook</a>
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
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
