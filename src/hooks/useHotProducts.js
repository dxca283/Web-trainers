import { useEffect, useState } from "react";
import { getHotProducts } from "../services/appwrite.js";

const useHotProducts = () => {
  const [hotProducts, setHotProducts] = useState([]);

  useEffect(() => {
    const loadHotProducts = async () => {
      try {
        const products = await getHotProducts();
        setHotProducts(products);
      } catch (error) {
        console.error("Error loading hot products", error);
      }
    };

    loadHotProducts();
  }, []);

  return [hotProducts];
};

export default useHotProducts;
