import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { verifyAccount } from "../services/authApi.js";
import Spinner from "../components/Spinner";

const VerifyAccountPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verify = async () => {
      try {
        const token = searchParams.get("token");

        if (!token) {
          toast.error("Thiếu token xác thực!");
          navigate("/", { replace: true });
          return;
        }

        setLoading(true);
        const res = await verifyAccount(token);

        toast.success(res.message || "Xác thực tài khoản thành công!");

        setTimeout(() => {
          navigate("/sign-in", { replace: true });
        }, 2500);
      } catch (err) {
        console.error("Lỗi verify account:", err);
        toast.error(err.message || "Xác thực tài khoản thất bại");
        navigate("/", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [searchParams, navigate]);

  return (
    <div className="text-center py-10 flex flex-col items-center justify-center">
      <h1 className="text-2xl text-white mb-4">Đang xác thực tài khoản...</h1>
      {loading && <Spinner loading={true} />}
      {!loading && (
        <button
          onClick={() => navigate("/", { replace: true })}
          className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Quay về trang chủ
        </button>
      )}
    </div>
  );
};

export default VerifyAccountPage;
