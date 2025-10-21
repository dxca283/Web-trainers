import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../services/authApi.js";
import Button from "../components/Button.jsx";
import Spinner from "../components/Spinner.jsx"; // thêm Spinner vào page
import { toast } from "react-toastify";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { ok, data } = await forgotPassword(email);

      if (ok) {
        toast.success(data.message || "Link đặt lại mật khẩu đã được gửi!");
        navigate("/check-email");
      } else {
        toast.error(data.message || "Có lỗi xảy ra");
      }
    } catch (err) {
      toast.error(err.message || "Có lỗi xảy ra");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card relative">
        {submitting && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-10">
            <Spinner size="lg" />
          </div>
        )}
        <h2 className="auth-title">Quên mật khẩu</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="email"
            className="auth-input"
            placeholder="Nhập email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" disabled={submitting}>
            Gửi link đặt lại mật khẩu
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
