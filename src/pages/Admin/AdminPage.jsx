import StatCard from "../../components/StatCard";
import { useAuth } from "../../hooks/useAuth.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getDashboardStats, getProfit } from "../../services/reportApi.js";

const AdminPage = () => {
  const [startDate, setStartDate] = useState(new Date("2025-9-1"));
  const [endDate, setEndDate] = useState(new Date("2025-10-1"));
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [profitData, setProfitData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getDashboardStats(
          startDate.toISOString(),
          endDate.toISOString()
        );

        setStats(res.stats);
        setChartData(res.revenueOverTime);
        setTopProducts(res.topProducts);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu dashboard:", err);
      }
    };

    fetchData();
  }, [startDate, endDate]);

  // Lấy profit
  useEffect(() => {
    const fetchProfit = async () => {
      try {
        const data = await getProfit();
        setProfitData(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfit();
  }, []);
  if (!stats) {
    return (
      <div className="flex justify-center items-center h-96 text-white text-xl">
        Đang tải dữ liệu thống kê...
      </div>
    );
  }
  const filteredData = chartData.filter((item) => {
    const d = new Date(item.date);
    return d >= startDate && d <= endDate;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gradient-sunset">
        👑 Admin Dashboard
      </h1>
      <p className="text-gradient text-3xl text-center">
        Xin chào <strong>{user.name}</strong>
      </p>
      {/* Cards thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 m-4">
        <StatCard title="Doanh thu hôm nay" value={stats.revenueToday} />
        <StatCard title="Doanh thu tháng này" value={stats.revenueMonth} />
        <StatCard title="Số đơn hàng hôm nay" value={stats.ordersToday} />
        <StatCard title="Tổng số đơn hàng" value={stats.totalOrders} />
        <StatCard title="Số đơn hàng hủy" value={stats.cancelled} />
        <StatCard title="Số đơn hàng hoàn trả" value={stats.returned} />
        <StatCard title="Khách hàng mới" value={stats.customers} />
        <StatCard
          title="Tổng lợi nhuận"
          value={profitData?.total_profit || 0}
        />
      </div>
      {/* Bộ lọc + Biểu đồ */}
      <div className="bg-dark-100 p-6 rounded-2xl shadow-inner shadow-light-100/10 space-y-4">
        {/* DatePicker */}
        <div className="flex gap-4 items-center bg-dark-200 p-2 rounded">
          <div className="flex items-center gap-2">
            <span className="text-white">Từ:</span>
            <div className="relative">
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                dateFormat="dd/MM/yyyy"
                className="px-2 py-1 rounded border border-gray-400 text-white" // thêm border và màu text
              />
              <FaCalendarAlt className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-white">Đến:</span>
            <div className="relative">
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                dateFormat="dd/MM/yyyy"
                className="px-2 py-1 rounded border border-gray-400 text-white"
              />
              <FaCalendarAlt className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Tiêu đề */}
        <h3 className="text-white text-4xl text-center font-semibold mb-15">
          Doanh thu ({startDate.toLocaleDateString()} -{" "}
          {endDate.toLocaleDateString()})
        </h3>

        {/* Biểu đồ */}
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={filteredData} className="p-3">
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis
              dataKey="date"
              stroke="#a8b5db"
              tickFormatter={(str) =>
                str ? new Date(str).toLocaleDateString() : ""
              }
            />
            <YAxis
              stroke="#a8b5db"
              tickFormatter={(val) =>
                val > 0 ? `${val.toLocaleString()}₫` : ""
              }
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f0d23",
                borderRadius: "8px",
                border: "1px solid #a8b5db",
              }}
              labelFormatter={(str) =>
                str ? new Date(str).toLocaleDateString() : ""
              }
              formatter={(value) =>
                value > 0 ? `${value.toLocaleString()}₫` : ""
              }
            />
            <Bar
              dataKey="revenue"
              fill="#AB8BFF"
              radius={[6, 6, 0, 0]} // Bo góc trên cột
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top sản phẩm bán chạy */}
      <div className="bg-dark-100 p-6 rounded-2xl shadow-inner shadow-light-100/10 mt-6">
        <h3 className="text-white text-4xl text-center font-semibold mb-15">
          🏆 Top sản phẩm bán chạy
        </h3>

        {/* Biểu đồ */}
        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topProducts.slice(0, 5)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis
                tickFormatter={(value) => Math.floor(value)}
                allowDecimals={false}
              />
              <Tooltip />
              <Bar dataKey="sold" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Bảng sản phẩm */}
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-light-100/20 text-light-200">
              <th className="py-2 px-3">#</th>
              <th className="py-2 px-3">Sản phẩm</th>
              <th className="py-2 px-3">Số lượng</th>
              <th className="py-2 px-3">Doanh thu</th>
            </tr>
          </thead>
          <tbody>
            {topProducts.slice(0, 10).map((prod, idx) => (
              <tr
                key={idx}
                className="border-b border-light-100/10 hover:bg-dark-200 transition"
              >
                <td className="py-2 px-3 text-light-200">{idx + 1}</td>
                <td className="py-2 px-3 text-white font-medium">
                  {prod.name}
                </td>
                <td className="py-2 px-3 text-light-200">{prod.sold}</td>
                <td className="py-2 px-3 text-gradient">
                  {prod.revenue.toLocaleString()}$
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Biểu đồ thống kê đơn hàng */}
      <div className="bg-dark-100 p-6 rounded-2xl shadow-inner shadow-light-100/10 mt-6">
        <h3 className="text-white text-4xl text-center font-semibold mb-15">
          📊 Thống kê trạng thái đơn hàng
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* BarChart */}
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: "Hoàn thành", value: stats.completed },
                  { name: "Hủy", value: stats.cancelled },
                  { name: "Hoàn trả", value: stats.returned },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="name" stroke="#a8b5db" />
                <YAxis stroke="#a8b5db" />
                <Tooltip />
                <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* PieChart */}
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: "Hoàn thành", value: stats.completed },
                    { name: "Hủy", value: stats.cancelled },
                    { name: "Hoàn trả", value: stats.returned },
                  ]}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  <Cell fill="#34d399" />
                  <Cell fill="#f87171" />
                  <Cell fill="#fbbf24" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
