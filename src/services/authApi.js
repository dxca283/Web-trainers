

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
      // data chứa token và thông tin user
      return data;
    } else {
      // lỗi từ server, ví dụ sai username/password
      throw new Error(data.message || "Đăng nhập thất bại");
    }
  } catch (err) {
    console.error(err);
    throw new Error("Không thể kết nối tới server");
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
      return data; // trả về { message, userId }
    } else {
      throw new Error(data.message || "Đăng ký thất bại");
    }
  } catch (err) {
    console.error(err);
    throw new Error("Không thể kết nối tới server");
  }
};
