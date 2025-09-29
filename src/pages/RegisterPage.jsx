import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { registerApi } from "../services/authApi.js";
import { toast } from "react-toastify";
import Button from "../components/Button.jsx";

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

  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error("Mật khẩu nhập lại không khớp");
      return;
    }

    try {
      setSubmitting(true);
      const { confirmPassword, ...userData } = form;
      await registerApi(userData);

      toast.success("Đăng ký thành công! Vui lòng xác thực email.");
      navigate("/verify-notice", { state: { email: form.email } });
    } catch (err) {
      toast.error(err.message || "Đăng ký thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <h2 className="auth-title">Đăng ký</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          {[
            {
              id: "full_name",
              label: "Họ và tên",
              type: "text",
              autoComplete: "name",
            },
            {
              id: "username",
              label: "Username",
              type: "text",
              autoComplete: "username",
            },
            {
              id: "email",
              label: "Email",
              type: "email",
              autoComplete: "email",
            },
            {
              id: "phone",
              label: "Số điện thoại",
              type: "tel",
              autoComplete: "tel",
            },
            {
              id: "password",
              label: "Mật khẩu",
              type: "password",
              autoComplete: "new-password",
            },
            {
              id: "confirmPassword",
              label: "Nhập lại mật khẩu",
              type: "password",
              autoComplete: "new-password",
            },
            {
              id: "address",
              label: "Địa chỉ",
              type: "text",
              autoComplete: "street-address",
            },
          ].map(({ id, label, type, autoComplete }) => (
            <div key={id}>
              <label htmlFor={id} className="auth-label">
                {label}
              </label>
              <input
                type={type}
                id={id}
                className="auth-input"
                placeholder={`Nhập ${label.toLowerCase()}`}
                autoComplete={autoComplete}
                value={form[id]}
                onChange={handleChange}
                required
              />
            </div>
          ))}
          <Button type="submit">
            {submitting ? (
              <span className="animate-bounce">Đang xác nhận ...</span>
            ) : (
              "Đăng ký"
            )}
          </Button>
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
