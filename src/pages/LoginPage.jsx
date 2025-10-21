import { loginApi } from "../services/authApi.js";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth.js";
import Button from "../components/Button.jsx";
import Spinner from "../components/Spinner.jsx";

const LoginPage = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await loginApi(form.username, form.password);
      login({token: res.token });
      navigate("/");
    } catch (error) {
      console.error("Đăng nhập thất bại:", error);
      setError(error.message || "Đăng nhập không thành công");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <h2 className="auth-title">Đăng nhập</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
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
            <label htmlFor="password" className="auth-label">
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              className="auth-input"
              placeholder="Nhập mật khẩu"
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          {error && <div className="text-red-500 text-sm mb-2">{error}</div>}

          <Button type="submit" loading={submitting}>
            Đăng nhập
          </Button>
        </form>

        <div className="auth-links">
          <Link to="/sign-up" className="auth-link">
            Đăng ký
          </Link>
          <Link to="/" className="auth-link">
            Về trang chủ
          </Link>
          <Link to="/forgot-password" className="auth-link">
            Quên mật khẩu
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
