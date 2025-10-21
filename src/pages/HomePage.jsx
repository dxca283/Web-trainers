import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getCategories } from "../services/categoryApi";
import Spinner from "../components/Spinner";

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error("Lỗi khi fetch categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);
  if (loading) return <Spinner loading={loading} />;

  return (
    <div className="w-full max-w-6xl mx-auto flex-1 py-6 relative">
      <div className="absolute inset-0 -z-10 bg-gradient-to-r " />
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        slidesPerView={1}
        loop={true}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        className="homepage-swiper"
      >
        {categories.map((cat) => (
          <SwiperSlide key={cat.id}>
            <Link to={`/categories/${cat.id}`} className="block relative group">
              <img
                src={cat.banner_url}
                alt={cat.name}
                className="homepage-slide-img"
              />
              <div className="homepage-slide-overlay">
                <h2 className="homepage-slide-title">{cat.name}</h2>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HomePage;
