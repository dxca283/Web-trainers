import { useCart } from "../hooks/useCart.js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner.jsx";
import Button from "../components/Button.jsx";

const CartPage = () => {
  const {
    cart,
    loading,
    updateQuantity,
    removeItem,
    total,
    checkout,
    loadingCheckout,
  } = useCart();

  const [checkoutError, setCheckoutError] = useState("");
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  const handleCheckoutClick = async () => {
    try {
      setCheckoutError("");
      const res = await checkout();
      navigate("/confirm-order", { state: { order: res.order } });
    } catch (err) {
      console.error(err);
      setCheckoutError(err.message || "Thanh toán thất bại");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">Giỏ hàng</h1>

      {cart.length === 0 ? (
        <div className="text-center py-20 text-gray-300">
          <p>Giỏ hàng trống.</p>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center bg-gray-800 p-4 rounded-lg"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="ml-4 flex-1">
                  <h3 className="text-white">{item.name}</h3>
                  <p className="text-gray-400">
                    Size: {item.size_label || "N/A"}
                  </p>
                  <p className="text-yellow-400 font-bold">
                    {item.price.toLocaleString("vi-VN")}$
                  </p>
                </div>

                <div className="flex items-center">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-2 py-1 bg-gray-600 text-white rounded 
               hover:bg-gray-500 active:scale-95 transition transform"
                  >
                    -
                  </button>
                  <span className="px-3 text-white">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-2 py-1 bg-gray-600 text-white rounded 
               hover:bg-gray-500 active:scale-95 transition transform"
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

          {checkoutError && (
            <p className="text-red-500 mt-4">{checkoutError}</p>
          )}

          <div className="mt-10 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">
              Tổng: {total.toLocaleString("vi-VN")}$
            </h2>

            <Button
              onClick={handleCheckoutClick}
              disabled={loadingCheckout || cart.length === 0}
              className="px-6 py-3 w-48 flex justify-center items-center"
            >
              {loadingCheckout ? (
                <span className="animate-bounce">Đang xác nhận ...</span>
              ) : (
                "Xác nhận đơn hàng"
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
