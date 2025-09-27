import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../hooks/useAuth";
import { getUserProfile, updateUserProfile } from "../services/userApi";
import Spinner from "../components/Spinner";
import Button from "../components/Button";

const ProfilePage = () => {
  const { token } = useAuth();

  const [form, setForm] = useState({
    full_name: "",
    username: "",
    email: "",
    phone: "",
    address: "",
  });

  const [initialForm, setInitialForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await updateUserProfile(token, form);
      toast.success("Cập nhật thông tin thành công");
      setInitialForm(form);
    } catch {
      toast.error("Cập nhật thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  const isUnchanged =
    initialForm && JSON.stringify(form) === JSON.stringify(initialForm);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  const fields = [
    { id: "full_name", label: "Họ và tên", type: "text" },
    { id: "username", label: "Username", type: "text", disabled: true },
    { id: "email", label: "Email", type: "email" },
    { id: "phone", label: "Số điện thoại", type: "tel" },
    { id: "address", label: "Địa chỉ", type: "text" },
  ];

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <h2 className="auth-title">Thông tin cá nhân</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          {fields.map(({ id, label, type, disabled }) => (
            <div key={id}>
              <label className="auth-label">{label}</label>
              <input
                type={type}
                id={id}
                className="auth-input"
                value={form[id]}
                onChange={handleChange}
                disabled={disabled}
              />
            </div>
          ))}

          <Button
            type="submit"
            loading={submitting}
            disabled={isUnchanged || submitting}
          >
            {submitting ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
