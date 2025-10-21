import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { getProductsByCategory } from "../services/prodApi.js";
import { getCategoryById } from "../services/categoryApi.js";
import Spinner from "../components/Spinner.jsx";



const CategoryPage = () => {
  const { category_id } = useParams(); // id lấy từ URL /categories/:id
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setProducts([]);
    setLoading(true);

    const fetchCategoryAndProducts = async () => {
      try {
        const catData = await getCategoryById(category_id);
        setCategory(catData);

        const prodData = await getProductsByCategory(category_id);
        setProducts(prodData);
      } catch (err) {
        console.error("Lỗi fetch:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryAndProducts();
  }, [category_id]);

  if (loading) return <Spinner loading={loading} />;


  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">
        {category ? category.name : "Danh mục"}
      </h1>

      {products.length === 0 ? (
        <p className="text-gradient">
          Chưa có sản phẩm nào trong danh mục này.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
