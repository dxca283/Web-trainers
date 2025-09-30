import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { cancelOrder, getOrderById } from "../services/orderApi.js";
import { useAuth } from "../hooks/useAuth.js";
import { createPaypalOrder } from "../services/paymentApi.js";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import Button from "../components/Button.jsx";

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
  const [loadingPay, setLoadingPay] = useState(false);
  const [loadingCancel, setLoadingCancel] = useState(false);

  // --- State cho địa chỉ theo chuẩn PayPal ---
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [stateProvince, setStateProvince] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [countryCode, setCountryCode] = useState("VN");

  // Tính ngày giao dự kiến
  useEffect(() => {
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
  }, [shippingMethod]);

  // Lấy order từ query
  // Lấy order từ state hoặc fetch từ API
  useEffect(() => {
    const fetchOrder = async () => {
      if (order) return; // Nếu đã có order từ Cart, không fetch nữa

      const query = new URLSearchParams(window.location.search);
      const orderId = query.get("order_id");
      if (!orderId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getOrderById(token, Number(orderId));

        // map lại structure giống Cart → OrderPage
        const mappedOrder = {
          ...data,
          items: data.order_items?.map((item) => ({
            id: item.id,
            product_id: item.product_id,
            size_id: item.size_id,
            quantity: item.quantity,
            price: item.price,
            products: item.products,
            size_label: item.sizes?.size_label || "N/A",
          })),
          total_amount: data.total_amount,
          status: data.status,
        };

        setOrder(mappedOrder);
      } catch (err) {
        console.error("Fetch order error:", err);
        toast.error("Không tìm thấy đơn hàng.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
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
        <Button
          onClick={() => navigate("/cart")}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Quay lại giỏ hàng
        </Button>
      </div>
    );
  }

  const { items = [], total_amount, status, id } = order || {};

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  let dynamicShippingFee = shippingFees[shippingMethod] || 0;

  
  const extraFeeUnits = Math.floor(totalQuantity / 5);
  const extraFee = extraFeeUnits * 2;

  dynamicShippingFee += extraFee;

  let additionalFeeMessage = "";
  if (extraFee > 0) {
    additionalFeeMessage = `Bạn đặt ${totalQuantity} đôi → phí ship cộng thêm $${extraFee}`;
  }

  const totalWithShipping = Number(total_amount) + dynamicShippingFee;

  const handleCancelOrder = async () => {
    try {
      setLoadingCancel(true);
      await cancelOrder(token, id);
      toast.success("Hủy đơn hàng thành công");
      navigate("/");
    } catch (error) {
      console.error("Cancel order error:", error);
      toast.error("Có lỗi xảy ra khi hủy đơn hàng");
    } finally {
      setLoadingCancel(false);
    }
  };

  const handlePaypalPayment = async () => {
    if (
      !addressLine1 ||
      !city ||
      !stateProvince ||
      !postalCode ||
      !countryCode
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin địa chỉ");
      return;
    }

    try {
      setLoadingPay(true);
      localStorage.setItem(`shippingMethod-${id}`, shippingMethod);

      const shippingAddress = {
        address_line_1: addressLine1,
        address_line_2: addressLine2,
        admin_area_2: city,
        admin_area_1: stateProvince,
        postal_code: postalCode,
        country_code: countryCode,
      };

      const res = await createPaypalOrder(
        token,
        id,
        dynamicShippingFee,
        shippingAddress
      );
      if (res.approve_url) {
        window.location.href = res.approve_url;
      } else {
        toast.warn("Không tìm thấy link thanh toán PayPal");
      }
    } catch (error) {
      console.error("PayPal error:", error);
      toast.error("Thanh toán thất bại");
    } finally {
      setLoadingPay(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Xác nhận đơn hàng</h1>
      <p className="mb-2 text-gray-400">
        Mã đơn hàng: <span className="text-white">{id}</span>
      </p>
      <p className="mb-6 text-gray-400">
        Trạng thái: <span className="text-yellow-400">{status}</span>
      </p>

      {/* Thông tin người nhận */}
      <div className="mb-6 text-gray-400 space-y-3">
        <h2 className="text-white font-semibold mb-2">Thông tin người nhận</h2>
        <p>
          Tên: <span className="text-white">{user.full_name || "N/A"}</span>
        </p>
        <p>
          Điện thoại: <span className="text-white">{user.phone || "N/A"}</span>
        </p>
      </div>

      {/* Form nhập địa chỉ */}
      <div className="mb-6 text-gray-400 space-y-3">
        <h2 className="text-white font-semibold mb-2">Địa chỉ giao hàng</h2>

        <div>
          <label className="block text-white mb-1">
            Đường, số nhà (address_line_1):
          </label>
          <input
            type="text"
            value={addressLine1}
            onChange={(e) => setAddressLine1(e.target.value)}
            placeholder="Số nhà, tên đường"
            className="w-full bg-gray-700 text-white p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-white mb-1">
            Địa chỉ thêm (address_line_2, tùy chọn):
          </label>
          <input
            type="text"
            value={addressLine2}
            onChange={(e) => setAddressLine2(e.target.value)}
            placeholder="Tầng, căn hộ…"
            className="w-full bg-gray-700 text-white p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-white mb-1">
            Thành phố (admin_area_2):
          </label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Hà Nội, Hồ Chí Minh…"
            className="w-full bg-gray-700 text-white p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-white mb-1">
            Tỉnh / Bang (admin_area_1):
          </label>
          <input
            type="text"
            value={stateProvince}
            onChange={(e) => setStateProvince(e.target.value)}
            placeholder="Hà Nội, HCM…"
            className="w-full bg-gray-700 text-white p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-white mb-1">
            Mã bưu chính (postal_code):
          </label>
          <input
            type="text"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            placeholder="100000"
            className="w-full bg-gray-700 text-white p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-white mb-1">
            Quốc gia (country_code):
          </label>
          <input
            type="text"
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value.toUpperCase())}
            placeholder="VN"
            className="w-full bg-gray-700 text-white p-2 rounded"
          />
        </div>
      </div>

      {/* Phương thức giao hàng */}
      <div className="mb-6">
        <label className="block mb-1 text-white font-medium">
          Phương thức giao hàng:
        </label>
        <select
          value={shippingMethod}
          onChange={(e) => setShippingMethod(e.target.value)}
          className="bg-gray-700 text-white p-2 rounded w-full"
        >
          <option value="fast">Giao hàng hỏa tốc (24h) - $10</option>
          <option value="standard">Giao hàng tiêu chuẩn (2-3 ngày) - $6</option>
          <option value="economy">Giao hàng tiết kiệm (4-5 ngày) - $3</option>
        </select>
      </div>

      {/* Ngày giao hàng dự kiến */}
      <p className="mb-6 text-white">
        Ngày giao dự kiến: <span className="font-semibold">{deliveryDate}</span>
      </p>

      {/* Danh sách sản phẩm */}
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
                Đơn giá: ${item.price.toLocaleString("vi-VN")}
              </p>
            </div>
            <span className="text-white font-bold px-4">{item.quantity}x</span>
          </div>
        ))}
      </div>

      {/* Tổng tiền + Nút thao tác */}
      <div className="mt-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Tổng: ${totalWithShipping.toLocaleString("vi-VN")}
          </h2>
          <p className="text-gray-400 text-sm">
            (Giá sp: ${total_amount.toLocaleString("vi-VN")} + Ship: $
            {dynamicShippingFee.toLocaleString("vi-VN")})
          </p>
          {additionalFeeMessage && (
            <p className="text-red-500 font-semibold mt-1">
              {additionalFeeMessage}
            </p>
          )}
        </div>

        <div className="flex gap-4">
          <Button
            onClick={handlePaypalPayment}
            disabled={loadingPay}
            className="px-6 py-3 min-w-[140px] text-base bg-blue-600 hover:bg-blue-700"
          >
            {loadingPay ? (
              <span className="inline-block animate-bounce">
                Đang thanh toán ...
              </span>
            ) : (
              "Thanh toán"
            )}
          </Button>

          <Button
            onClick={handleCancelOrder}
            disabled={loadingCancel}
            className="px-6 py-3 min-w-[140px] text-base bg-red-600 hover:bg-red-700"
          >
            {loadingCancel ? (
              <span className="inline-block animate-bounce">Đang hủy ...</span>
            ) : (
              "Hủy đơn"
            )}
          </Button>

          <Button
            onClick={() => navigate("/")}
            className="px-6 py-3 min-w-[140px] text-base bg-green-600 hover:bg-green-700"
          >
            Trang chủ
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
