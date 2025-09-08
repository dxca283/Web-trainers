import { useState } from "react";

const ImageGallery = ({ images }) => {
  const [selected, setSelected] = useState(images[0]);

  return (
    <div>
      {/* Ảnh chính */}
      <img
        src={selected}
        alt="product"
        className="w-full h-96 object-cover rounded-lg mb-4"
      />

      {/* Ảnh nhỏ */}
      <div className="grid grid-cols-4 gap-2">
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={`thumb-${i + 1}`}
            className={`h-20 object-cover rounded-lg cursor-pointer border-2 ${
              img === selected ? "border-blue-500" : "border-transparent"
            }`}
            onClick={() => setSelected(img)}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
