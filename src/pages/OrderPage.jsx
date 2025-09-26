import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { cancelOrder, getOrderById } from "../services/orderApi.js";
import { useAuth } from "../hooks/useAuth.js";
import { createPaypalOrder } from "../services/paymentApi.js";
import { toast } from "react-toastify";
import dayjs from "dayjs";

const shippingFees = {
  fast: 10,
  standard: 6,
  economy: 3,
};

const OrderPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);
  const [shippingMethod, setShippingMethod] = useState("fast");
  const [deliveryDate, setDeliveryDate] = useState("");

  // Tính ngày giao dự kiến
  useEffect(() => {
    const calculateDeliveryDate = () => {
      const today = dayjs();
      let daysToAdd = 1;

      switch (shippingMethod) {
        case "standard":
          daysToAdd = 3;
          break;
        case "economy":
          daysToAdd = 5;
          break;
        case "fast":
        default:
          daysToAdd = 1;
      }

      setDeliveryDate(today.add(daysToAdd, "day").format("DD/MM/YYYY"));
    };

    calculateDeliveryDate();
  }, [shippingMethod]);

  
  useEffect(() => {
    const fetchOrder = async () => {
      const query = new URLSearchParams(window.location.search);
      const orderId = query.get("order_id");
      if (!orderId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getOrderById(token, Number(orderId));
        setOrder(data);
      } catch (err) {
        console.error("Fetch order error:", err);
        toast.error("Không tìm thấy đơn hàng.");
      } finally {
        setLoading(false);
      }
    };

    if (!order) fetchOrder();
  }, [order, token]);

  if (loading) {
    return (
      <div className="text-center py-10">
        <h1 className="text-xl text-white">Đang tải thông tin đơn hàng...</h1>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4 text-red-500">
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
  const shippingFee = shippingFees[shippingMethod] || 0;
  const totalWithShipping = total_amount + shippingFee;

  const handleCancelOrder = async () => {
    try {
      await cancelOrder(token, id);
      toast.success("Hủy đơn hàng thành công");
      navigate("/");
    } catch (error) {
      console.error("Cancel order error:", error);
      toast.error("Có lỗi xảy ra khi hủy đơn hàng");
    }
  };

  const handlePaypalPayment = async () => {
    try {
      localStorage.setItem(`shippingMethod-${id}`, shippingMethod);
      const res = await createPaypalOrder(token, id);
      if (res.approve_url) {
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
      <p className="mb-2 text-gray-400">
        Mã đơn hàng: <span className="text-white">{id}</span>
      </p>
      <p className="mb-2 text-gray-400">
        Trạng thái: <span className="text-yellow-400">{status}</span>
      </p>

      {/* Thông tin người dùng */}
      <div className="mb-6 text-gray-400 space-y-1">
        <p>
          Tên người nhận: <span className="text-white">{user.full_name || "N/A"}</span>
        </p>
        <p>
          Địa chỉ: <span className="text-white">{user.address || "N/A"}</span>
        </p>
        <p>
          Số điện thoại: <span className="text-white">{user.phone || "N/A"}</span>
        </p>
      </div>

      {/* Phương thức giao hàng */}
      <div className="mb-6">
        <label className="block mb-1 text-white font-medium">Phương thức giao hàng:</label>
        <select
          value={shippingMethod}
          onChange={(e) => setShippingMethod(e.target.value)}
          className="bg-gray-700 text-white p-2 rounded w-full"
        >
          <option value="fast">
            Giao hàng hỏa tốc (trong 24h) - Phí vận chuyển: $10
          </option>
          <option value="standard">
            Giao hàng tiêu chuẩn (2-3 ngày) - Phí vận chuyển: $6
          </option>
          <option value="economy">
            Giao hàng tiết kiệm (4-5 ngày) - Phí vận chuyển: $3
          </option>
        </select>
      </div>

      {/* Ngày giao hàng dự kiến */}
      <p className="mb-6 text-white">
        Ngày giao dự kiến: <span className="font-semibold">{deliveryDate}</span>
      </p>

      {/* Danh sách sản phẩm */}
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center bg-gray-800 p-4 rounded-lg">
            <img
              src={item.products?.product_images?.[0]?.image_url || "/placeholder.png"}
              alt={item.products?.name || "Sản phẩm"}
              className="w-24 h-24 object-cover rounded"
            />
            <div className="ml-4 flex-1">
              <h3 className="text-white">{item.products?.name}</h3>
              <p className="text-gray-400">Size: {item.size_label || "N/A"}</p>
              <p className="text-yellow-400 font-bold">
                Đơn giá: ${(item.price * item.quantity).toLocaleString("vi-VN")}
              </p>
            </div>
            <span className="text-white font-bold px-4">{item.quantity}x</span>
          </div>
        ))}
      </div>

      {/* Tổng tiền và các nút thao tác */}
      <div className="mt-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Tổng: ${(totalWithShipping).toLocaleString("vi-VN")}
          </h2>
          <p className="text-gray-400 text-sm">
            (Giá sản phẩm: ${total_amount.toLocaleString("vi-VN")} + Phí vận chuyển: ${shippingFee.toLocaleString("vi-VN")})
          </p>
        </div>
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
