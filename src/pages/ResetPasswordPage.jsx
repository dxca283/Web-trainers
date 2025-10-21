import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { resetPassword } from "../services/authApi.js";
import Button from "../components/Button.jsx";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);
  const token = query.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Mật khẩu không khớp");
      return;
    }

    try {
      setSubmitting(true);
      const { ok, data } = await resetPassword(token, password);

      if (ok) {
        toast.success(data.message || "Đổi mật khẩu thành công");
        setTimeout(() => navigate("/sign-in"), 2000);
      } else {
        toast.error(data.message || "Có lỗi xảy ra");
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <h2 className="auth-title">Đặt lại mật khẩu</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="password"
            placeholder="Mật khẩu mới"
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Nhập lại mật khẩu"
            className="auth-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {/* Dùng Button nâng cấp, tự hiển thị spinner khi submitting */}
          <Button type="submit" loading={submitting}>
            Xác nhận
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
