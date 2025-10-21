import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

export default function UserMenu({ user, logout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/sign-in");
  };

  if (!user) return null;

  return (
    <div className="relative group inline-block z-50">
      {/* Nút chính */}
      <button className="flex items-center space-x-2 hover:text-white font-semibold text-gray-200">
        <FaUserCircle className="text-xl" />
        <span>{user.name}</span>
      </button>

      {/* Menu User */}
      <ul className="absolute top-full right-0 bg-gray-800 text-gray-200 rounded-md shadow-lg w-48 opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-opacity duration-200 z-50">
        {user.role === "admin" && (
          <li>
            <Link
              to="admin"
              className="block px-4 py-2 hover:bg-gray-700 text-yellow-400 font-semibold"
            >
              Admin
            </Link>
          </li>
        )}
        <li>
          <Link
            to="/edit-profile"
            className="block px-4 py-2 hover:bg-gray-700"
          >
            Chỉnh sửa thông tin
          </Link>
        </li>

        <li>
          <Link
            to="/change-password"
            className="block px-4 py-2 hover:bg-gray-700"
          >
            Đổi mật khẩu
          </Link>
        </li>
        <li>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 hover:bg-gray-700 text-red-400"
          >
            Đăng xuất
          </button>
        </li>
      </ul>
    </div>
  );
}
