import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { registerApi } from "../services/authApi.js";

const RegisterPage = () => {
  const [form, setForm] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    address: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const newUser = await registerApi(form);

      // Lưu user vào localStorage sau khi đăng ký
      localStorage.setItem("user", JSON.stringify(newUser));

      // Điều hướng sang trang chủ
      navigate("/");
    } catch (err) {
      setError(err.message);
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
              id="fullname"
              className="auth-input"
              placeholder="Nhập họ và tên"
              autoComplete="name"
              value={form.fullname}
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
          {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
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
