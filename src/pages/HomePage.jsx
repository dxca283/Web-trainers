import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

const categories = [
  {
    name: "Nike",
    image: "/banners/nike.jpg",
    link: "/category/nike",
  },
  {
    name: "Adidas",
    image: "/banners/adidas.jpg",
    link: "/category/adidas",
  },
  {
    name: "Puma",
    image: "/banners/puma.jpg",
    link: "/category/puma",
  },
  {
    name: "Vans",
    image: "/banners/vans.jpg",
    link: "/category/vans",
  },
];

const HomePage = () => {
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
        {categories.map((cat, index) => (
          <SwiperSlide key={index}>
            <a href={cat.link} className="block relative group">
              <img
                src={cat.image}
                alt={cat.name}
                className="homepage-slide-img"
              />
              <div className="homepage-slide-overlay">
                <h2 className="homepage-slide-title">{cat.name}</h2>
              </div>
            </a>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HomePage;
