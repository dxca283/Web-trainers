import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { capturePaypalOrder } from "../services/paymentApi.js";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";

const PaymentSuccessPage = () => {
  const { token } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const capture = async () => {
      try {
        const orderId = searchParams.get("db_order_id"); // single-order DB ID
        const paypalOrderId = searchParams.get("token"); // single-order PayPal ID

        if (!orderId || !paypalOrderId) {
          toast.error("Thiếu dữ liệu thanh toán! Không thể xác nhận đơn.");
          navigate("/", { replace: true });
          return;
        }

        setLoading(true);
        await capturePaypalOrder(token, paypalOrderId, Number(orderId));
        toast.success("Thanh toán đơn hàng thành công!");

        setTimeout(() => {
          navigate("/order-history", { replace: true });
        }, 1500);
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
      <h1 className="text-2xl text-white mb-4">Đang xác nhận thanh toán...</h1>
      {loading && <Spinner loading={true} />}
      {!loading && (
        <button
          onClick={() => navigate("/", { replace: true })}
          className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Quay về trang chủ
        </button>
      )}
    </div>
  );
};

export default PaymentSuccessPage;
