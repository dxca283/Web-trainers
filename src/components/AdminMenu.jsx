import { Link } from "react-router-dom";

const adminMenu = [
  { path: "/admin", label: "📊 Overview" },
  { path: "/admin/users", label: "👤 Quản lý Users" },
  { path: "/admin/products", label: "🛒 Quản lý Products" },
];

const AdminMenu = () => {
  return (
    <aside className="w-64 bg-gray-800 text-white flex flex-col">
      <div className="p-4 text-xl font-bold border-b border-gray-700">
        Admin Panel
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {adminMenu.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="block px-3 py-2 rounded hover:bg-gray-700"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default AdminMenu;
