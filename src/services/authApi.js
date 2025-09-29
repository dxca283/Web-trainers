import API_URL from "../../config/config.js";

// authApi.js
export const loginApi = async (username, password) => {
  try {
    const res = await fetch(`${API_URL}/api/v1/auth/sign-in`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok) {
      return data;
    } else {
      throw new Error(data.message || "Đăng nhập thất bại");
    }
  } catch (err) {
    console.error(err);
    throw new Error(err.message || "Không thể kết nối tới server");
  }
};

export const registerApi = async (userData) => {
  try {
    const res = await fetch(`${API_URL}/api/v1/auth/sign-up`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await res.json();

    if (res.ok) {
      return data;
    } else {
      throw new Error(data.message || "Đăng ký thất bại");
    }
  } catch (err) {
    console.error(err);
    throw new Error(err.message || "Không thể kết nối tới server");
  }
};

export const resetPassword = async (token, password) => {
  try {
    const res = await fetch(`${API_URL}/api/v1/auth/reset-password`, {
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
    const res = await fetch(`${API_URL}/api/v1/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }

    return { ok: res.ok, data };
  } catch (error) {
    console.error(error);
    throw new Error("Không thể kết nối tới server");
  }
};


export const changePassword = async (token, oldPassword, newPassword) => {
  try {
    const res = await fetch(`${API_URL}/api/v1/users/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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

export const verifyAccount = async (token) => {
  try {
    const res = await fetch(
      `${API_URL}/api/v1/auth/verify-account?token=${token}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();

    if (res.ok) {
      return data;
    } else {
      throw new Error(data.message || "Xác thực thất bại");
    }
  } catch (err) {
    console.error(err);
    throw new Error(err.message || "Không thể kết nối tới server");
  }
};


export const resendVerifyApi = async (email) => {
  try {
    const res = await fetch(`${API_URL}/api/v1/auth/resend-verify-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (res.ok) {
      return data;
    } else {
      throw new Error(data.message || "Gửi lại email xác thực thất bại");
    }
  } catch (err) {
    console.error(err);
    throw new Error(err.message || "Không thể kết nối tới server");
  }
};
