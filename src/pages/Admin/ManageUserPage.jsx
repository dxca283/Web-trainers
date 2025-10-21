import { useState, useEffect } from "react";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
} from "../../services/userApi.js";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth.js";
import Spinner from "../../components/Spinner.jsx";

const ManageUserPage = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formChanged, setFormChanged] = useState(false);
  const [originalData, setOriginalData] = useState(null);

  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    full_name: "",
    email: "",
    phone: "",
    address: "",
    role: "customer",
  });
  const { token } = useAuth();

  // fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers(token, filter);
      setUsers(data);
    } catch (err) {
      console.error("Lỗi lấy danh sách user:", err);
      toast.error(err.message || "Không lấy được danh sách người dùng");
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, [filter]);

  const handleOpenForm = (user = null) => {
    if (user) {
      // edit user
      setFormData({
        username: user.username || "",
        password: "",
        full_name: user.full_name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        role: user.role || "customer",
      });
      setOriginalData({
        username: user.username || "",
        full_name: user.full_name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        role: user.role || "customer",
      });
    } else {
      // thêm mới
      setFormData({
        username: "",
        password: "",
        full_name: "",
        email: "",
        phone: "",
        address: "",
        role: "customer",
      });
      setOriginalData(null);
    }

    setFormChanged(false);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa người dùng này?")) return;
    try {
      await deleteUser(id, token);
      toast.success("Đã xóa người dùng");
      setUsers(users.filter((u) => u.id !== id));
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = await toggleUserStatus(id, token);
      toast.success(
        `Đã ${newStatus === "blocked" ? "chặn" : "mở khóa"} người dùng`
      );
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status: newStatus } : u))
      );
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      full_name: formData.full_name,
      email: formData.email,
      role: formData.role,
      phone: formData.phone || null,
      address: formData.address || null,
    };

    if (!editingUser) {
      payload.username = formData.username;
      payload.password = formData.password;
    } else if (formData.password) {
      payload.password = formData.password;
    }

    try {
      if (editingUser) {
        // Cập nhật user
        const updated = await updateUser(editingUser.id, payload, token);
        toast.success("Cập nhật người dùng thành công");
        setUsers(users.map((u) => (u.id === updated.id ? updated : u)));
      } else {
        // Tạo mới user
        const created = await createUser(payload, token);
        toast.success("Tạo người dùng mới thành công");
        setUsers([created, ...users]);
      }

      // Đóng form
      setShowForm(false);
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      toast.error(err.message || "Có lỗi xảy ra");
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormChanged(true);
  };

  if (loading) return <Spinner />;
  if (error)
    return (
      <div className="text-red-400 text-center p-10 text-lg">
        ⚠️ Lỗi: {error}
      </div>
    );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">👥 Quản lý người dùng</h1>
        <button
          onClick={() => handleOpenForm()}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white"
        >
          ➕ Thêm người dùng
        </button>
      </div>

      {/* Bộ lọc */}
      <div className="flex gap-3 mb-6">
        {["all", "admin", "staff", "customer"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-lg border capitalize ${
              filter === type
                ? "bg-violet-600 text-white border-violet-500"
                : "bg-gray-900 text-amber-50 border-gray-700 hover:bg-dark-300"
            } transition`}
          >
            {type === "all"
              ? "Tất cả"
              : type === "admin"
              ? "Quản trị viên"
              : type === "staff"
              ? "Nhân viên"
              : "Khách hàng"}
          </button>
        ))}
      </div>

      {/* Bảng người dùng */}
      <table className="w-full border border-gray-600 rounded-lg text-sm">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">Tên</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Vai trò</th>
            <th className="p-2 text-left">Trạng thái</th>
            <th className="p-2 text-left">Ngày tạo</th>
            <th className="p-2 text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center text-gray-400 py-6 italic">
                Không có người dùng nào
              </td>
            </tr>
          ) : (
            users.map((u) => (
              <tr
                key={u.id}
                className="border-t border-gray-700 text-white hover:bg-dark-200 transition"
              >
                <td className="p-2">{u.id}</td>
                <td className="p-2">{u.full_name}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2 capitalize">{u.role}</td>
                <td className="p-2">
                  {u.status === "blocked" ? (
                    <span className="text-red-400">Blocked</span>
                  ) : (
                    <span className="text-green-400">Active</span>
                  )}
                </td>
                <td className="p-2">
                  {new Date(u.createdAt).toLocaleDateString("vi-VN")}
                </td>
                <td className="p-2 flex justify-center gap-2">
                  <button
                    onClick={() => handleOpenForm(u)}
                    className="px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded text-white text-xs"
                  >
                    ✏️ Sửa
                  </button>
                  <button
                    onClick={() => handleToggleStatus(u.id, u.status)}
                    className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 rounded text-white text-xs"
                  >
                    {u.status === "blocked" ? "🔓 Mở" : "⛔ Chặn"}
                  </button>
                  <button
                    onClick={() => handleDelete(u.id)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-white text-xs"
                  >
                    🗑️ Xóa
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modal add/edit */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-dark-100 p-6 rounded-xl shadow-lg w-[420px]">
            <h2 className="text-xl text-white mb-4 font-semibold">
              {editingUser ? "✏️ Sửa người dùng" : "➕ Thêm người dùng"}
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              {/* Username */}
              <input
                name="username"
                placeholder="Tên đăng nhập"
                className="p-2 rounded bg-gray-800 text-white border border-gray-700"
                value={formData.username}
                onChange={handleInputChange}
                required
                disabled={!!editingUser} // không sửa username khi edit
              />

              {/* Password */}
              <input
                name="password"
                placeholder="Mật khẩu"
                type="password"
                className="p-2 rounded bg-gray-800 text-white border border-gray-700"
                value={formData.password}
                onChange={handleInputChange}
                required={!editingUser} // chỉ bắt buộc khi tạo mới
              />

              {/* Full Name */}
              <input
                name="full_name"
                placeholder="Họ và tên"
                className="p-2 rounded bg-gray-800 text-white border border-gray-700"
                value={formData.full_name}
                onChange={handleInputChange}
                required
              />

              {/* Email */}
              <input
                name="email"
                placeholder="Email"
                type="email"
                className="p-2 rounded bg-gray-800 text-white border border-gray-700"
                value={formData.email}
                onChange={handleInputChange}
                required
              />

              {/* Phone */}
              <input
                name="phone"
                placeholder="Số điện thoại"
                className="p-2 rounded bg-gray-800 text-white border border-gray-700"
                value={formData.phone}
                onChange={handleInputChange}
              />

              {/* Address */}
              <input
                name="address"
                placeholder="Địa chỉ"
                className="p-2 rounded bg-gray-800 text-white border border-gray-700"
                value={formData.address}
                onChange={handleInputChange}
              />

              {/* Role */}
              <select
                name="role"
                className="p-2 rounded bg-gray-800 text-white border border-gray-700"
                value={formData.role}
                onChange={handleInputChange}
                required
              >
                <option value="admin">Admin</option>
                <option value="staff">Staff</option>
                <option value="customer">Customer</option>
              </select>

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingUser(null);
                    setFormChanged(false);
                  }}
                  className="px-4 py-2 rounded bg-gray-700 text-white hover:bg-gray-600"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-violet-600 text-white hover:bg-violet-700 disabled:bg-gray-500"
                  disabled={editingUser && !formChanged} // disable nếu edit mà chưa sửa gì
                >
                  {editingUser ? "Lưu thay đổi" : "Tạo mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUserPage;
