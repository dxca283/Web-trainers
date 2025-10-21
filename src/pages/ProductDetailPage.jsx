import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import ImageGallery from "../components/ImageGallery";
import { getProductById } from "../services/prodApi.js";
import Button from "../components/Button.jsx";
import CartContext from "../context/CartContext.jsx";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner.jsx";

const ProductDetailPage = () => {
  const { product_id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  const { addItem } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductById(product_id);
        setProduct(data);

        if (data.product_sizes?.length > 0) {
          setSelectedSize(data.product_sizes[0].size_id);
        }
      } catch (err) {
        console.error("Lỗi khi fetch product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [product_id]);

  const handleAddToCart = async () => {
    if (!selectedSize) {
      toast.error("Vui lòng chọn size!");
      return;
    }

    try {
      setAdding(true);
      const res = await addItem({
        product_id: product.id,
        size_id: selectedSize,
        quantity,
      });
      toast.success(res.message);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <Spinner />
        <p>Đang tải sản phẩm...</p>
      </div>
    );
  }

  if (!product) return <p>Không tìm thấy sản phẩm</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Gallery ảnh */}
      <ImageGallery
        images={product.product_images.map((img) => img.image_url) || []}
      />

      {/* Thông tin sản phẩm */}
      <div>
        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
        <p className="text-gray-500 mb-4">{product.description}</p>
        <p className="text-2xl text-red-500 mb-6">
          ${product.price.toLocaleString("vi-VN")}
        </p>

        {/* Chọn size nếu có */}
        {product.product_sizes?.length > 0 && (
          <div className="mb-4">
            <label className="block mb-1 font-medium">Chọn size:</label>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(Number(e.target.value))}
              className="border rounded p-2 w-full bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {product.product_sizes.map((size) =>
                size.sizes ? (
                  <option key={size.id} value={size.size_id}>
                    {size.sizes.size_label} - {size.stock_quantity} đôi
                  </option>
                ) : null
              )}
            </select>
          </div>
        )}

        {/* Chọn số lượng */}
        <div className="mb-6">
          <label className="block mb-1 font-medium">Số lượng:</label>
          <input
            type="number"
            min="1"
            max={
              product.product_sizes.find((s) => s.size_id === selectedSize)
                ?.stock_quantity || 1
            }
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="border rounded p-2 w-full bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <Button onClick={handleAddToCart} loading={adding} type="button">
         {adding ? "Đang thêm..." : "Thêm sản phẩm"}
        </Button>
      </div>
    </div>
  );
};

export default ProductDetailPage;
