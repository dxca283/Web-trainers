import { useEffect, useRef } from "react";

const HotProducts = ({ hotProducts, allProducts }) => {
  const ulRef = useRef(null);

  useEffect(() => {
    const ul = ulRef.current;
    if (!ul) return;
    let scrollAmount = 0;
    const scrollStep = 2; 
    const interval = setInterval(() => {
      scrollAmount += scrollStep;
      if (scrollAmount >= ul.scrollWidth - ul.clientWidth) {
        scrollAmount = 0; 
      }
      ul.scrollTo({ left: scrollAmount, behavior: "smooth" });
    }, 50); 
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="trending">
      <ul ref={ulRef} className="flex gap-5 overflow-x-auto hide-scrollbar">
        {hotProducts.map((hp, index) => {
          const prod = allProducts.find((p) => p.id === hp.product_id);
          if (!prod) return null;
          return (
            <li key={hp.$id} className="relative flex flex-col items-center p-4 rounded-2xl shadow-lg">
              <p className="index absolute top-2 left-2 text-[1.5rem] font-bold text-yellow-400">{index + 1}</p>
              <img src={hp.prod_img || prod.thumbnail || "/placeholder.png"} alt={prod.name} className="w-[150px] h-[150px] rounded-lg object-cover"/>
              <p className="prod-name text-white font-bold text-sm text-center mt-2">{prod.name}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default HotProducts;
