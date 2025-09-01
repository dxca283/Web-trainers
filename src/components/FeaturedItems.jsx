import React from "react";
import { Link } from "react-router-dom";

const FeaturedItems = () => {
  const featuredItems = [
    {
      id: 1,
      title: "Women's Flex",
      subtitle: "Run Bigger",
      image: "/nike-vomero-feature.avif",
      link: "/womens-flex",
    },
    {
      id: 2,
      title: "Men's HD",
      subtitle: "Strength Starts Here",
      image: "/metcon10-feature.avif",
      link: "/mens-hd",
    },
    {
      id: 3,
      title: "For the Hoopers",
      subtitle: "",
      image: "/for-the-hoopers-feature.avif",
      link: "/hoopers",
    },
    {
      id: 4,
      title: "No Misses",
      subtitle: "",
      image: "/no-misses.avif",
      link: "/no-misses",
    },
  ];

  return (
    <section className="bg-white w-full">
      <h2 className="text-center font-medium text-lg py-6">Featured</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 w-full">
        {featuredItems.map((item) => (
          <Link
            key={item.id}
            to={item.link}
            className="relative w-full h-[300px] md:h-[500px]"
          >
            {/* Full-fit Image */}
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-fill" // fills cell without cropping
            />

            {/* Overlay */}
            <div className="absolute bottom-3 left-3 text-white">
              <p className="text-xs font-medium">{item.title}</p>
              {item.subtitle && (
                <p className="text-lg font-bold">{item.subtitle}</p>
              )}
              <button className="mt-1 bg-white text-black px-3 py-0.5 rounded-full text-xs font-semibold hover:bg-gray-200">
                Shop
              </button>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default FeaturedItems;
