import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { changePassword } from "../services/authApi.js";
import { useAuth } from "../hooks/useAuth.js";
import Button from "../components/Button.jsx";
import Spinner from "../components/Spinner.jsx";

const ChangePasswordPage = () => {
  const { token, logout } = useAuth();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu mới không khớp");
      return;
    }

    try {
      setSubmitting(true);
      const { ok, data } = await changePassword(
        token,
        oldPassword,
        newPassword
      );

      if (ok) {
        toast.success("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
        logout();

        setSubmitting(false);
        setRedirecting(true);

        setTimeout(() => {
          navigate("/sign-in");
        }, 1500);
      } else {
        toast.error(data.message || "Đổi mật khẩu thất bại");
      }
    } catch (err) {
      toast.error(err.message || "Có lỗi xảy ra");
    } finally {
      setSubmitting(false);
    }
  };

  if (redirecting) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

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
          <Button type="submit" disabled={submitting}>
            {submitting ? (
              <span className="animate-bounce">Đang xác nhận...</span>
            ) : (
              "Xác nhận"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
