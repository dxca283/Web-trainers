
//Sign-in
export const loginApi = async (username, password) => {
  try {
    const res = await fetch(
      `http://localhost:5000/users?username=${username}&password=${password}`
    );
    const data = await res.json();

    if (res.ok && data.length > 0) {
      return data[0]; 
    } else {
      throw new Error("Sai tên đăng nhập hoặc mật khẩu");
    }
  } catch (err) {
    console.error(err);
    throw new Error("Không thể kết nối tới server");
  }
};

// Sign-up
export const registerApi = async (userData) => {
  try {
    const res = await fetch("http://localhost:5000/users", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!res.ok) throw new Error("Không thể đăng ký");
    return await res.json(); 
  } catch {
    throw new Error("Lỗi kết nối server");
  }
};