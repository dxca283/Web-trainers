import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* nội dung chính */}
      <main className="flex-1">
        <Outlet /> {/* hoặc Routes / nội dung */}
      </main>
      
      <Footer />
    </div>
  );
};

export default MainLayout;
