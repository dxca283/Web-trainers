import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth.js";
import { getOrders } from "../services/orderApi.js";
import { createPaypalOrder } from "../services/paymentApi.js"; // thêm cancelOrder
import { toast } from "react-toastify";
import { cancelOrder } from "../services/orderApi.js";

const OrderHistoryPage = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("paid");
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const data = await getOrders(token, status);
        setOrders(data);
      } catch (err) {
        console.error(err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchOrders();
  }, [token, status]);

  const toggleOrder = (orderId) => {
    setSelectedOrder((prev) => (prev === orderId ? null : orderId));
  };

  const handlePay = async () => {
    if (!selectedOrder) {
      alert("Vui lòng chọn một đơn hàng để thanh toán.");
      return;
    }

    try {
      const data = await createPaypalOrder(token, selectedOrder);
      if (data.approve_url) {
        window.location.href = data.approve_url;
      } else {
        alert("Không tìm thấy link thanh toán PayPal.");
      }
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await cancelOrder(token, orderId);
      toast.success("Hủy đơn hàng thành công");
      setOrders((prev) => prev.filter((o) => o.id !== orderId)); // update UI
      if (selectedOrder === orderId) setSelectedOrder(null);
    } catch (error) {
      console.error("Cancel order error:", error);
      toast.error("Có lỗi xảy ra khi hủy đơn hàng");
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 text-white">
      <h1 className="text-2xl font-bold mb-6">Đơn hàng của tôi</h1>

      {/* Toggle */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => {
            setStatus("pending");
            setSelectedOrder(null);
          }}
          className={`px-4 py-2 rounded ${status === "pending" ? "bg-blue-500" : "bg-gray-700"}`}
        >
          Đang chờ thanh toán
        </button>
        <button
          onClick={() => {
            setStatus("paid");
            setSelectedOrder(null);
          }}
          className={`px-4 py-2 rounded ${status === "paid" ? "bg-blue-500" : "bg-gray-700"}`}
        >
          Đã thanh toán
        </button>
      </div>

      {/* Loading */}
      {loading && <div className="text-center py-10">Đang tải đơn hàng...</div>}

      {/* Empty */}
      {!loading && orders.length === 0 && (
        <div className="text-center py-10">
          <h1>
            {status === "paid"
              ? "Chưa có đơn hàng đã thanh toán."
              : "Không có đơn hàng chờ thanh toán."}
          </h1>
        </div>
      )}

      {/* Orders */}
      {!loading && orders.length > 0 && (
        <>
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-gray-800 rounded-lg p-4 flex justify-between">
                <div className="flex items-start">
                  {status === "pending" && (
                    <input
                      type="checkbox"
                      className="mr-3 mt-1"
                      checked={selectedOrder === order.id}
                      onChange={() => toggleOrder(order.id)}
                    />
                  )}
                  <div>
                    <p><span className="font-semibold">Mã đơn hàng:</span> {order.id}</p>
                    <p>
                      <span className="font-semibold">Trạng thái:</span>{" "}
                      <span className={order.status === "paid" ? "text-green-400" : "text-yellow-400"}>
                        {order.status}
                      </span>
                    </p>
                    <p>
                      <span className="font-semibold">Tổng tiền:</span>{" "}
                      {order.total_amount.toLocaleString("vi-VN")} ₫
                    </p>
                    <h2 className="font-semibold mt-2">Sản phẩm:</h2>
                    <ul className="ml-4 list-disc">
                      {order.order_items?.map((item) => (
                        <li key={item.id}>
                          {item.products?.name} - Size {item.sizes?.size_label} - SL: {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Nút Hủy chỉ hiện khi đang tab Pending */}
                {status === "pending" && (
                  <button
                    onClick={() => handleCancelOrder(order.id)}
                    className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 self-start"
                  >
                    Hủy đơn
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Nút thanh toán */}
          {status === "pending" && (
            <div className="mt-6 text-right">
              <button
                onClick={handlePay}
                className="bg-green-500 px-6 py-2 rounded hover:bg-green-600"
              >
                Thanh toán đơn hàng
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OrderHistoryPage;
