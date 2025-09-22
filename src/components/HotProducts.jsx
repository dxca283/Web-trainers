import { Link } from "react-router-dom";

const HotProducts = ({ hotProducts, allProducts }) => {
  return (
    <>
      {hotProducts.length > 0 && (
        <section className="trending">
          <ul>
            {hotProducts.map((hp, index) => {
              const prod = allProducts.find((p) => p.id === hp.product_id);
              if (!prod) return null;
              return (
                <li key={hp.$id}>
                  <p className="index">{index + 1}</p>
                  <Link
                    to={`/ProductDetail/${prod.id}`}
                    className="flex flex-col items-center"
                  >
                    <img
                      src={hp.prod_img || prod.thumbnail || "/placeholder.png"}
                      alt={prod.name}
                    />
                    <p className="prod-name">{prod.name}</p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </>
  );
};

export default HotProducts;
