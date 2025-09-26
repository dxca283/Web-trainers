import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getOrderById } from "../services/orderApi.js"; 
import { useAuth } from "../hooks/useAuth.js";
import Spinner from "../components/Spinner.jsx";

const ConfirmOrderPage = () => {
  const { token } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const orderId = query.get("order_id");

    if (!orderId) {
      
      return;
    }

    const fetchOrder = async () => {
      try {
        const data = await getOrderById(token, Number(orderId));
        setOrder(data);
      } catch (err) {
        console.error(err);
       
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [location, token, navigate]);

  if (loading) {
  return <Spinner loading={loading} />;
}


  if (!order) {
    return (
      <div className="text-center py-10">
        <h1 className="text-xl text-red-500">Không tìm thấy đơn hàng</h1>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10 text-white">
      <h1 className="text-2xl font-bold mb-6">Xác nhận đơn hàng</h1>

      <div className="bg-gray-800 rounded-lg p-6 shadow-md">
        <p><span className="font-semibold">Mã đơn hàng:</span> {order.id}</p>
        <p><span className="font-semibold">Trạng thái:</span> {order.status}</p>
        <p><span className="font-semibold">Tổng tiền:</span> {order.total_amount} USD</p>
      
        <h2 className="text-xl font-semibold mt-6 mb-3">Sản phẩm</h2>
        <ul className="space-y-2">
          {order.items?.map((item) => (
            <li key={item.id} className="border-b border-gray-600 pb-2">
              {item.product_name} - Size {item.size} - SL: {item.quantity}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ConfirmOrderPage;
