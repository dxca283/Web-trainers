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

  return (
    <div className="text-center py-10 flex flex-col items-center justify-center">
      {loading && (
        <>
          <h1 className="text-2xl text-white mb-4">
            Đang xác nhận thanh toán...
          </h1>
          <Spinner loading={true} />
        </>
      )}

      {!loading && orderInfo && (
        <div className="bg-white rounded-lg p-6 shadow-md w-full max-w-md text-left">
          <h2 className="text-xl font-semibold mb-4">Thanh toán thành công!</h2>
          <p>
            <strong>Mã đơn hàng:</strong> {orderInfo.id}
          </p>
          <p>
            <strong>Email:</strong> {orderInfo.users?.email}
          </p>
          <p>
            <strong>Tổng tiền:</strong> {orderInfo.total_amount}
          </p>
          <p>
            <strong>Trạng thái:</strong> {orderInfo.status}
          </p>
          <h3 className="mt-4 font-semibold">Sản phẩm:</h3>
          <ul className="list-disc ml-6">
            {orderInfo.order_items.map((item) => (
              <li key={item.id}>
                {item.products.name} - SL: {item.quantity} - Giá: {item.price}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-green-600">Email xác nhận đã được gửi!</p>
          <button
            onClick={() => navigate("/", { replace: true })}
            className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Quay về trang chủ
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentSuccessPage;
