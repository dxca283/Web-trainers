import AdminMenu from "../components/AdminMenu";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="min-h-screen flex">
      <AdminMenu />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 ">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
export default AdminLayout;
