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

export const resetPassword = async (token, password) => {
  try {
    const res = await fetch("http://localhost:5500/api/v1/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword: password }),
    });

    const data = await res.json();
    return { ok: res.ok, data };
  } catch (error) {
    console.error(error);
    throw new Error("Không thể kết nối tới server");
  }
};

export const forgotPassword = async (email) => {
  try {
    const res = await fetch("http://localhost:5500/api/v1/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    return { ok: res.ok, data };
  } catch (error) {
    console.error(error);
    throw new Error("Không thể kết nối tới server");
  }
};

export const changePassword = async (oldPassword, newPassword) => {
  try {
    const token = localStorage.getItem("token"); // nếu backend yêu cầu token
    const res = await fetch("http://localhost:5500/api/v1/users/change-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // nếu API cần xác thực
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    });

    const data = await res.json();
    return { ok: res.ok, data };
  } catch (error) {
    console.error(error);
    throw new Error("Không thể kết nối tới server");
  }
};