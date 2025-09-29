import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { capturePaypalOrder } from "../services/paymentApi.js";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import { getOrderById } from "../services/orderApi.js";

const PaymentSuccessPage = () => {
  const { token } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orderInfo, setOrderInfo] = useState(null);

  useEffect(() => {
    const capture = async () => {
      try {
        const orderId = searchParams.get("db_order_id");
        const paypalOrderId = searchParams.get("token");

        if (!orderId || !paypalOrderId) {
          toast.error("Thiếu dữ liệu thanh toán! Không thể xác nhận đơn.");
          navigate("/", { replace: true });
          return;
        }

        setLoading(true);

        // 1️⃣ Capture PayPal
        await capturePaypalOrder(token, paypalOrderId, Number(orderId));

        // 2️⃣ Lấy thông tin chi tiết đơn
        const res = await getOrderById(token, orderId);
        setOrderInfo(res);

        toast.success("Thanh toán đơn hàng thành công! Email xác nhận đã gửi.");
      } catch (err) {
        console.error("Lỗi capture PayPal:", err);
        toast.error("Xác nhận thanh toán thất bại");
        navigate("/", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    capture();
  }, [searchParams, token, navigate]);

  if (loading) {
    return (
      <div className="auth-bg flex flex-col items-center justify-center min-h-screen text-center">
        <h1 className="text-3xl font-semibold text-white mb-6">
          Đang xác nhận thanh toán...
        </h1>
        <Spinner loading={true} size="lg" />
      </div>
    );
  }

  if (!orderInfo) {
    return null; // hoặc hiển thị fallback
  }

  return (
    <div className="auth-bg flex items-center justify-center min-h-screen p-4">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-lg text-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 mb-4 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl font-bold">
            ✓
          </div>
          <h2 className="text-2xl font-bold mb-2">Thanh toán thành công!</h2>
          <p className="text-gray-600 mb-4">
            Email xác nhận đã được gửi tới <span className="font-semibold">{orderInfo.users?.email}</span>
          </p>
        </div>

        <div className="text-left border-t border-gray-200 pt-4 mt-4">
          <p className="mb-1"><strong>Mã đơn hàng:</strong> {orderInfo.id}</p>
          <p className="mb-1"><strong>Tổng tiền:</strong> {orderInfo.total_amount.toLocaleString()}$</p>
          <p className="mb-1"><strong>Trạng thái:</strong> {orderInfo.status}</p>

          <h3 className="mt-4 mb-2 font-semibold">Sản phẩm:</h3>
          <ul className="list-disc list-inside space-y-1">
            {orderInfo.order_items.map((item) => (
              <li key={item.id}>
                {item.products.name} - SL: {item.quantity} - Đơn giá: {Number(item.price).toLocaleString()}$
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={() => navigate("/", { replace: true })}
          className="mt-6 w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Quay về trang chủ
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
