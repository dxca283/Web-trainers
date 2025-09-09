import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
      const res = await fetch("http://localhost:5500/api/v1/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Đổi mật khẩu thành công");
        setTimeout(() => navigate("/sign-in"), 2000);
      } else {
        toast.error(data.message || "Có lỗi xảy ra");
      }
    } catch (err) {
      toast.error("Không thể kết nối tới server");
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
          <button type="submit" className="auth-btn">Xác nhận</button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
