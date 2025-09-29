import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../hooks/useAuth.js";
import { getOrders, cancelOrder } from "../services/orderApi.js";
import Button from "../components/Button.jsx";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner.jsx";

const OrderHistoryPage = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("paid");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

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

  const handleGoToConfirm = () => {
    if (!selectedOrder) {
      toast.error("Vui lòng chọn một đơn hàng để thanh toán.");
      return;
    }
    // Chuyển sang confirm-order page với orderId
    navigate(`/confirm-order?order_id=${selectedOrder}`);
  };

  const handleCancelOrder = async (orderId) => {
    try {
      setCancellingId(orderId);
      await cancelOrder(token, orderId);
      toast.success("Hủy đơn hàng thành công");
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      if (selectedOrder === orderId) setSelectedOrder(null);
    } catch (error) {
      console.error("Cancel order error:", error);
      toast.error("Có lỗi xảy ra khi hủy đơn hàng");
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 text-white">
      <h1 className="text-2xl font-bold mb-6">Đơn hàng của tôi</h1>

      {/* Toggle */}
      <div className="flex gap-4 mb-6">
        <Button
          onClick={() => {
            setStatus("pending");
            setSelectedOrder(null);
          }}
          className={status === "pending" ? "bg-blue-500" : "bg-gray-700"}
        >
          Đang chờ thanh toán
        </Button>
        <Button
          onClick={() => {
            setStatus("paid");
            setSelectedOrder(null);
          }}
          className={status === "paid" ? "bg-blue-500" : "bg-gray-700"}
        >
          Đã thanh toán
        </Button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-10">
          <Spinner />
        </div>
      )}

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
              <div
                key={order.id}
                className="bg-gray-800 rounded-lg p-4 flex justify-between"
              >
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
                    <p>
                      <span className="font-semibold">Mã đơn hàng:</span>{" "}
                      {order.id}
                    </p>
                    <p>
                      <span className="font-semibold">Trạng thái:</span>{" "}
                      <span
                        className={
                          order.status === "paid"
                            ? "text-green-400"
                            : "text-yellow-400"
                        }
                      >
                        {order.status}
                      </span>
                    </p>
                    <p>
                      <span className="font-semibold">Tổng tiền:</span>{" "}
                      {order.total_amount.toLocaleString("vi-VN")} $
                    </p>
                    <h2 className="font-semibold mt-2">Sản phẩm:</h2>
                    <ul className="ml-4 list-disc">
                      {order.order_items?.map((item) => (
                        <li key={item.id}>
                          {item.products?.name} - Size {item.sizes?.size_label}{" "}
                          - SL: {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Nút Hủy */}
                {status === "pending" && (
                  <Button
                    onClick={() => handleCancelOrder(order.id)}
                    className="bg-red-500 hover:bg-red-600 self-start w-36 flex justify-center items-center relative"
                    disabled={cancellingId === order.id}
                    loading={cancellingId === order.id}
                  >
                    {cancellingId === order.id ? "Đang hủy..." : "Hủy đơn"}
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Nút Thanh toán */}
          {status === "pending" && (
            <div className="mt-6 text-right">
              <Button
                onClick={handleGoToConfirm}
                className="bg-green-500 hover:bg-green-600 w-48 flex justify-center items-center relative"
                disabled={!selectedOrder}
              >
                Thanh toán đơn hàng
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OrderHistoryPage;
