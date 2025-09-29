import { useState } from "react";
import { toast } from "react-toastify";
import Button from "../components/Button.jsx";
import { resendVerifyApi } from "../services/authApi.js";
import { useLocation } from "react-router-dom";

const VerifyNoticePage = () => {
  const location = useLocation();
  const email = location.state?.email;
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    try {
      setLoading(true);
      await resendVerifyApi(email);
      toast.success("Email xác thực đã được gửi lại!");
    } catch (err) {
      toast.error(err.message || "Gửi lại email thất bại");
    } finally {
      setLoading(false);
    }
  };

  if (!email)
    return (
      <div className="auth-bg flex items-center justify-center min-h-screen">
        <div className="auth-card text-center">
          <p>Không có email để xác thực.</p>
        </div>
      </div>
    );

  return (
    <div className="auth-bg flex items-center justify-center min-h-screen">
      <div className="auth-card text-center">
        <h1 className="auth-title text-gradient">Xác thực tài khoản</h1>
        <p className="mt-4 text-gradient">
          Chúng tôi đã gửi một email xác thực tới{" "}
          <span className="font-semibold">{email}</span>.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Nếu bạn không nhận được email, hãy kiểm tra hộp thư Spam hoặc nhấn nút dưới đây để gửi lại.
        </p>

        <Button
          onClick={handleResend}
          disabled={loading}
          className="mt-6 px-6 py-3 text-base bg-blue-600 hover:bg-blue-700 text-white rounded-md"
        >
          {loading ? "Đang gửi..." : "Gửi lại email xác thực"}
        </Button>
      </div>
    </div>
  );
};

export default VerifyNoticePage;
