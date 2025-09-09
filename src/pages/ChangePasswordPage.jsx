import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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
      const token = localStorage.getItem("token"); // nếu backend yêu cầu token
      const res = await fetch("http://localhost:5500/api/v1/users/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // nếu API cần xác thực
        },
        body: JSON.stringify({ oldPassword, newPassword  }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
        setTimeout(() => navigate("/"), 2000);
      } else {
        toast.error(data.message || "Đổi mật khẩu thất bại");
      }
    } catch (err) {
      toast.error("Không thể kết nối tới server");
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
          <button type="submit" className="auth-btn">Xác nhận</button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
