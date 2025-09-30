import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth.js";
import { getFavoriteProducts } from "../services/userApi.js";
import ProductCard from "../components/ProductCard.jsx";
import Spinner from "../components/Spinner.jsx";
import { toast } from "react-toastify";

const FavoriteProductsPage = () => {
  const { token } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchFavorites = async () => {
      setLoading(true);
      try {
        const data = await getFavoriteProducts(token);
        setFavorites(data);
      } catch (err) {
        console.error(err);
        toast.error("Không tải được danh sách yêu thích");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-5xl text-gradient text-center font-semibold mb-4">
        Sản phẩm yêu thích
      </h2>
      {favorites.length === 0 ? (
        <p className="text-3xl text-gradient">Chưa có sản phẩm yêu thích nào.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {favorites.map((f) => (
            <ProductCard
              key={f.product_id}
              product={f.products}
              onRemove={() =>
                setFavorites((prev) =>
                  prev.filter((p) => p.product_id !== f.product_id)
                )
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoriteProductsPage;
