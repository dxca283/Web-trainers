import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const imageUrl =
    product.product_images[0]?.image_url;

  return (
    <Link
      to={`/ProductDetail/${product.id}`}
      className="product-card block rounded-lg overflow-hidden shadow hover:shadow-lg transition"
    >
      <img
        src={imageUrl} 
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-semibold">{product.name}</h3>
        <div className="content mt-2">
          <span>{product.price.toLocaleString("vi-VN")} ₫</span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
