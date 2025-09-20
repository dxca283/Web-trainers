import { useLocation, useNavigate } from "react-router-dom";
import { cancelOrder } from "../services/orderApi.js";
import { useAuth } from "../hooks/useAuth.js";
import { createPaypalOrder } from "../services/paymentApi.js";
import { toast } from "react-toastify";

const OrderPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { order } = location.state || {};
  const { token } = useAuth();

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">
          Không có đơn hàng để hiển thị
        </h1>
        <button
          onClick={() => navigate("/cart")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Quay lại giỏ hàng
        </button>
      </div>
    );
  }

  const { items, total_amount, status, id } = order;

  const handleCancelOrder = async () => {
    try {
      await cancelOrder(token, id);
      navigate("/");
    } catch (error) {
      console.error("Cancel order error:", error);
      toast.error("Có lỗi xảy ra khi hủy đơn hàng");
    }
  };

  const handlePaypalPayment = async () => {
    try {
      // 1. Tạo PayPal Order
      const res = await createPaypalOrder(token, id);
      if (res.approve_url) {
        // Redirect sang PayPal
        window.location.href = res.approve_url;
      } else {
        toast.warn("Không tìm thấy link thanh toán PayPal");
      }
    } catch (error) {
      console.error("PayPal error:", error);
      toast.error("Thanh toán thất bại");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Xác nhận đơn hàng</h1>
      <p className="mb-4 text-gray-400">
        Mã đơn hàng: <span className="text-white">{id}</span>
      </p>
      <p className="mb-6 text-gray-400">
        Trạng thái: <span className="text-yellow-400">{status}</span>
      </p>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center bg-gray-800 p-4 rounded-lg"
          >
            <img
              src={
                item.products?.product_images?.[0]?.image_url ||
                "/placeholder.png"
              }
              alt={item.products?.name || "Sản phẩm"}
              className="w-24 h-24 object-cover rounded"
            />
            <div className="ml-4 flex-1">
              <h3 className="text-white">{item.products?.name}</h3>
              <p className="text-gray-400">Size: {item.size_label || "N/A"}</p>
              <p className="text-yellow-400 font-bold">
                {(item.price * item.quantity).toLocaleString("vi-VN")} ₫
              </p>
            </div>
            <span className="text-white font-bold px-4">{item.quantity}x</span>
          </div>
        ))}
      </div>

      <div className="mt-10 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">
          Tổng: {total_amount.toLocaleString("vi-VN")} ₫
        </h2>
        <div className="flex gap-4">
          <button
            onClick={handlePaypalPayment}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Thanh toán
          </button>
          <button
            onClick={handleCancelOrder}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Hủy đơn
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
