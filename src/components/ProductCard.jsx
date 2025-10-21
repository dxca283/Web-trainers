import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { useEffect, useState } from "react";
import {
  getFavoriteProducts,
  removeFavoriteProduct,
  addFavoriteProduct,
} from "../services/userApi";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { toast } from "react-toastify";

const ProductCard = ({ product, onRemove }) => {
  const { token } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false); // 👈 thêm state

  const imageUrl =
    product.thumbnail ||
    product.product_images?.[0]?.image_url ||
    "/placeholder.png";
  const price = product.price ?? 0;

  useEffect(() => {
    if (!token) return;
    const checkFavorite = async () => {
      try {
        const favorites = await getFavoriteProducts(token);
        const found = favorites.some((f) => f.product_id === product.id);
        setIsLiked(found);
      } catch (err) {
        console.error(err);
      }
    };
    checkFavorite();
  }, [product.id, token]);

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("Vui lòng đăng nhập để thêm sản phẩm yêu thích");
      return;
    }
    try {
      if (isLiked) {
        await removeFavoriteProduct(token, product.id);
        setIsLiked(false);
        if (onRemove) {
          setIsRemoving(true); // 👈 bật fade-out
          setTimeout(() => {
            onRemove(); // xoá khỏi list cha sau 300ms
          }, 300);
        }
      } else {
        await addFavoriteProduct(token, product.id);
        setIsLiked(true);
      }
    } catch (err) {
      console.error(err);
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
    }
  };

  return (
    <Link
      to={`/ProductDetail/${product.id}`}
      className={`product-card block rounded-lg overflow-hidden shadow hover:shadow-lg transition 
        ${isRemoving ? "opacity-0 transform scale-95 transition duration-300" : "opacity-100"}`}
    >
      <img
        src={imageUrl}
        alt={product.name || "Sản phẩm"}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-semibold">{product.name || "Chưa có tên"}</h3>
        <div className="content mt-2 flex items-center justify-between">
          <span>{price.toLocaleString("vi-VN")}$</span>
          <div
            className="cursor-pointer text-red-500 text-xl hover:text-red-600 transition-colors"
            onClick={handleToggleFavorite}
          >
            {isLiked ? <FaHeart /> : <FaRegHeart />}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
