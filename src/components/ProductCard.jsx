import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const imageUrl =
    product.thumbnail ||
    product.product_images?.[0]?.image_url ||
    "/placeholder.png";
  ("/placeholder.png");
  const price = product.price ?? 0;

  return (
    <Link
      to={`/ProductDetail/${product.id}`}
      className="product-card block rounded-lg overflow-hidden shadow hover:shadow-lg transition"
    >
      <img
        src={imageUrl}
        alt={product.name || "Sản phẩm"}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-semibold">{product.name || "Chưa có tên"}</h3>
        <div className="content mt-2">
          <span>{price.toLocaleString("vi-VN")} ₫</span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
