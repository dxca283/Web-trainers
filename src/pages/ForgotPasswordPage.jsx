import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../services/authApi.js";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const { ok, data } = await forgotPassword(email);

      setMessage(data.message);

      if (ok) {
        navigate("/check-email");
      }
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
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
          <button type="submit" className="auth-btn">Gửi link đặt lại mật khẩu</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
