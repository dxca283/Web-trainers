import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";


const CategoryPage = () => {
  const { category_id } = useParams(); // id lấy từ URL /categories/:id
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      try {
        // Lấy category theo id
        const catRes = await fetch(`http://localhost:5000/categories/${category_id}`);
        if (!catRes.ok) throw new Error("Category not found");
        const catData = await catRes.json();
        setCategory(catData);

        // Lấy products theo category_id
        const prodRes = await fetch(
          `http://localhost:5000/products?category_id=${category_id}`
        );
        const prodData = await prodRes.json();
        setProducts(prodData);
      } catch (err) {
        console.error("Lỗi fetch:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryAndProducts();
  }, [category_id]);

  if (loading) return <p>Đang tải...</p>;

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
