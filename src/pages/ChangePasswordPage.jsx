import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { changePassword } from "../services/authApi.js";

const ChangePasswordPage = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu mới không khớp");
      return;
    }

    try {
      const { ok, data } = await changePassword(oldPassword, newPassword);

      if (ok) {
        toast.success("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
        setTimeout(() => navigate("/"), 2000);
      } else {
        toast.error(data.message || "Đổi mật khẩu thất bại");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <h2 className="auth-title">Đổi mật khẩu</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="password"
            placeholder="Mật khẩu cũ"
            className="auth-input"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Mật khẩu mới"
            className="auth-input"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Nhập lại mật khẩu mới"
            className="auth-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit" className="auth-btn">
            Xác nhận
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
