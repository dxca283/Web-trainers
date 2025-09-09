// authApi.js
export const loginApi = async (username, password) => {
  try {
    const res = await fetch("http://localhost:5500/api/v1/auth/sign-in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok) {
      return data; // data chứa token và thông tin user
    } else {
      throw new Error(data.message || "Đăng nhập thất bại");
    }
  } catch (err) {
    console.error(err);
    // Giữ lại message gốc nếu có
    throw new Error(err.message || "Không thể kết nối tới server");
  }
};

export const registerApi = async (userData) => {
  try {
    const res = await fetch("http://localhost:5500/api/v1/auth/sign-up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await res.json();

    if (res.ok) {
      return data; // { message, userId }
    } else {
      throw new Error(data.message || "Đăng ký thất bại");
    }
  } catch (err) {
    console.error(err);
    throw new Error(err.message || "Không thể kết nối tới server");
  }
};

export const changePasswordApi = async (data) => {
  try {
    const response = await fetch(`http://localhost:5500/api/v1/users/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      // Nếu server trả lỗi, lấy thông báo lỗi
      const errorData = await response.json();
      throw new Error(errorData.message || "Lỗi khi đổi mật khẩu");
    }

    const result = await response.json();
    return result; // ví dụ { message: "Đổi mật khẩu thành công" }
  } catch (error) {
    throw new Error(error.message || "Lỗi khi gọi API");
  }
};