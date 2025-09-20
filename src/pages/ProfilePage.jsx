import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../hooks/useAuth";
import { getUserProfile, updateUserProfile } from "../services/userApi";

const ProfilePage = () => {
  const { token } = useAuth();


  const [form, setForm] = useState({
    full_name: "",
    username: "",
    email: "",
    phone: "",
    address: "",
  });

  const [initialForm, setInitialForm] = useState(null); // lưu dữ liệu ban đầu

  // Load user profile từ API
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile(token);
        const userData = {
          full_name: data.full_name || "",
          username: data.username || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
        };
        setForm(userData);
        setInitialForm(userData);
      } catch {
        toast.error("Không tải được thông tin người dùng");
      }
    };
    fetchProfile();
    console.log("Token ở frontend:", token);
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUserProfile(token, form);
      toast.success("Cập nhật thông tin thành công");

      // set lại bản gốc = bản vừa lưu
      setInitialForm(form);
    } catch {
      toast.error("Cập nhật thất bại");
    }
  };

  // Check nếu chưa thay đổi gì
  const isUnchanged =
    initialForm && JSON.stringify(form) === JSON.stringify(initialForm);

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <h2 className="auth-title">Thông tin cá nhân</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div>
            <label className="auth-label">Họ và tên</label>
            <input
              type="text"
              id="full_name"
              className="auth-input"
              value={form.full_name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="auth-label">Username</label>
            <input
              type="text"
              id="username"
              className="auth-input"
              value={form.username}
              disabled
            />
          </div>

          <div>
            <label className="auth-label">Email</label>
            <input
              type="email"
              id="email"
              className="auth-input"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="auth-label">Số điện thoại</label>
            <input
              type="tel"
              id="phone"
              className="auth-input"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="auth-label">Địa chỉ</label>
            <input
              type="text"
              id="address"
              className="auth-input"
              value={form.address}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className={`auth-btn ${
              isUnchanged ? "bg-gray-400 cursor-not-allowed" : ""
            }`}
            disabled={isUnchanged}
          >
            Lưu thay đổi
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
