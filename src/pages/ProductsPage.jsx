import React, { useEffect, useState } from "react";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProds = async () => {
      try {
        const res = await fetch("http://localhost:5000/products");
        if (!res.ok) {
          throw new Error("Fail to fetch products");
        }
        const data = await res.json();
        setProducts(data || []);
      } catch (error) {
        console.log("Error fetching products", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProds();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Đang tải sản phẩm...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl text-gradient font-bold mb-8">Tất cả sản phẩm</h1>

      {products.length === 0 ? (
        <p className="text-gradient">Chưa có sản phẩm nào.</p>
      ) : (
        <div className="all-products">
          <ul>
            {products.map((product) => (
              <li key={product.id} className="product-card">
                <a href={`/product/${product.id}`}>
                  <img src={product.image} alt={product.name} />
                  <h3>{product.name}</h3>
                  <div className="content">
                    <span>{product.price.toLocaleString("vi-VN")} ₫</span>
                    {/* Nếu có thêm rating, year, brand thì để ở đây */}
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
