import API_URL from "../../config/config.js";

// src/services/reportApi.js
export const getDashboardStats = async (startDate, endDate) => {
  try {
    const query = new URLSearchParams();
    if (startDate) query.append("startDate", startDate);
    if (endDate) query.append("endDate", endDate);

    const res = await fetch(
      `${API_URL}/api/v1/reports/dashboard/stats?${query.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) throw new Error("Không thể lấy thống kê dashboard");
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Lỗi khi fetch dashboard stats:", err);
    throw err;
  }
};
export const getProfit = async () => {
  try {
    const res = await fetch(`${API_URL}/api/v1/reports/profit`);
    return res.json();
  } catch (error) {
    console.error("Lỗi khi lấy thống kê lợi nhuận:", error);
    throw error;
  }
};
