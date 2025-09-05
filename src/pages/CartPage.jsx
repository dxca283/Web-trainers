import { useCart } from "../hooks/useCart";
const CartPage = () => {
  const { cart, loading, updateQuantity, removeItem, total } = useCart();

  if (loading) return <p>Đang tải giỏ hàng...</p>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">Giỏ hàng</h1>

      {cart.length === 0 ? (
        <p>Giỏ hàng trống.</p>
      ) : (
        <>
          <div className="space-y-6">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center bg-gray-800 p-4 rounded-lg">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="ml-4 flex-1">
                  <h3 className="text-white">{item.product.name}</h3>
                  <p className="text-gray-400">Size: {item.size?.size_label || "N/A"}</p>
                  <p className="text-yellow-400 font-bold">
                    {item.product.price.toLocaleString("vi-VN")} ₫
                  </p>
                </div>

                <div className="flex items-center">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-2 py-1 bg-gray-600 text-white rounded"
                  >
                    -
                  </button>
                  <span className="px-3 text-white">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-2 py-1 bg-gray-600 text-white rounded"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  className="ml-4 text-red-400 hover:text-red-600"
                >
                  Xóa
                </button>
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">
              Tổng: {total.toLocaleString("vi-VN")} ₫
            </h2>
            <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
              Thanh toán
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
