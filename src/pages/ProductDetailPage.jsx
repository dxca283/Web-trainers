import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ImageGallery from "../components/ImageGallery";

const ProductDetailPage = () => {
  const { product_id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/products/${product_id}`);
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error("Lỗi khi fetch product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [product_id]);

  if (loading) return <p>Đang tải...</p>;
  if (!product) return <p>Không tìm thấy sản phẩm</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Gallery ảnh */}
      <ImageGallery images={[
        product.image, // ảnh chính
        "/products/sample1.jpg",
        "/products/sample2.jpg",
        "/products/sample3.jpg"
      ]} />

      {/* Thông tin sản phẩm */}
      <div>
        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
        <p className="text-gray-500 mb-4">{product.description}</p>
        <p className="text-2xl text-red-500 mb-6">
          {product.price.toLocaleString("vi-VN")} ₫
        </p>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
          Thêm vào giỏ hàng
        </button>
      </div>
    </div>
  );
};

export default ProductDetailPage;
