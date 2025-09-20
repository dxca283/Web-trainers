import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { capturePaypalOrder } from "../services/paymentApi.js";
import { toast } from "react-toastify";

const PaymentSuccessPage = () => {
  const { token } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const capture = async () => {
      try {
        // --- Lấy param từ query string ---
        const orderId = searchParams.get("db_order_id");       // single-order DB ID
        const paypalOrderId = searchParams.get("token");       // single-order PayPal ID

        if (!orderId || !paypalOrderId) {
          toast.error("Thiếu dữ liệu thanh toán! Không thể xác nhận đơn.");
          navigate("/", { replace: true });
          return;
        }

        // --- Capture single-order ---
        await capturePaypalOrder(token, paypalOrderId, Number(orderId));
        toast.success("Thanh toán đơn hàng thành công!");

        // Chuyển hướng về lịch sử đơn hàng sau 1.5s
        setTimeout(() => {
          navigate("/order-history", { replace: true });
        }, 1500);

      } catch (err) {
        console.error("Lỗi capture PayPal:", err);
        toast.error("Xác nhận thanh toán thất bại");
        navigate("/", { replace: true });
      }
    };

    capture();
  }, [searchParams, token, navigate]);

  return (
    <div className="text-center py-10">
      <h1 className="text-2xl text-white">Đang xác nhận thanh toán...</h1>
    </div>
  );
};

export default PaymentSuccessPage;
