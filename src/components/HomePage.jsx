import React from "react";
import FeaturedItems from "./FeaturedItems";

const HomePage = () => {
  return (
    <div className="HomePage">
      {/* Banner Section */}
      <div className="bg-gray-100 py-4 text-center">
        {/* Headline */}
        <p className="text-lg font-semibold">
          New Styles On Sale: Up To 40% Off
        </p>

        {/* Link */}
        <a
          href="#"
          className="text-sm font-semibold underline hover:text-gray-600 transition"
        >
          Shop All Our New Markdowns
        </a>
      </div>

      {/* Hero Image */}
      <div className="w-full h-[400px]">
        <img
          src="/hero-banner.jpg" // place your image inside public folder
          alt="Hero Banner"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Nike running Section */}
      <section className="text-center py-16 bg-white">
        {/* Small Title */}
        <p className="text-sm font-medium mb-4">Nike Running</p>

        {/* Main Headline */}
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
          MORE CHOICE. MORE RUNNING.
        </h1>

        {/* Subheadline */}
        <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8">
          Pegasus. Vomero. Structure. Three updated franchises for more
          cushioning and more performance.
        </p>

        {/* Button */}
        <a
          href="#"
          className="bg-black text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-gray-900 transition"
        >
          Shop
        </a>
      </section>

        {/* Featured Items Section */}
        <FeaturedItems />


        
    </div>
  );
};

export default HomePage;
