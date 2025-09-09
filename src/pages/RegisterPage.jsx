import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { registerApi } from "../services/authApi.js";
import { toast } from "react-toastify";

const RegisterPage = () => {
  const [form, setForm] = useState({
    full_name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    phone: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra confirm password
    if (form.password !== form.confirmPassword) {
      toast.error("Mật khẩu nhập lại không khớp");
      return;
    }

    try {
      const { confirmPassword, ...userData } = form;
      await registerApi(userData);

      toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate("/sign-in");
    } catch (err) {
      toast.error(err.message || "Đăng ký thất bại");
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <h2 className="auth-title">Đăng ký</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="fullname" className="auth-label">
              Họ và tên
            </label>
            <input
              type="text"
              id="full_name"
              className="auth-input"
              placeholder="Nhập họ và tên"
              autoComplete="name"
              value={form.full_name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="username" className="auth-label">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="auth-input"
              placeholder="Nhập Username"
              autoComplete="username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="auth-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="auth-input"
              placeholder="Nhập email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="auth-label">
              Số điện thoại
            </label>
            <input
              type="tel"
              id="phone"
              className="auth-input"
              placeholder="Nhập số điện thoại"
              autoComplete="tel"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="auth-label">
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              className="auth-input"
              placeholder="Nhập mật khẩu"
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="auth-label">
              Nhập lại mật khẩu
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="auth-input"
              placeholder="Nhập lại mật khẩu"
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="address" className="auth-label">
              Địa chỉ
            </label>
            <input
              type="text"
              id="address"
              className="auth-input"
              placeholder="Nhập địa chỉ"
              autoComplete="street-address"
              value={form.address}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="auth-btn">
            Đăng ký
          </button>
        </form>

        <div className="auth-links">
          <Link to="/sign-in" className="auth-link">
            Đăng nhập
          </Link>
          <Link to="/" className="auth-link">
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
