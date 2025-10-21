import API_URL from "../../config/config.js";

export const getUserProfile = async (token) => {
  try {
    const res = await fetch(`${API_URL}/api/v1/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Không lấy được profile");
    }

    return data;
  } catch (error) {
    console.error(error);
    throw new Error(error.message || "Không kết nối được tới server");
  }
};

export const updateUserProfile = async (token, userData) => {
  try {
    const res = await fetch(`${API_URL}/api/v1/users/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Không cập nhật được profile");
    }

    return data;
  } catch (error) {
    console.error(error);
    throw new Error(error.message || "Không kết nối được tới server");
  }
};

export const getFavoriteProducts = async (token) => {
  try {
    const res = await fetch(`${API_URL}/api/v1/users/favorites`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Không lấy được sản phẩm yêu thích");
    }

    return data;
  } catch (error) {
    console.error(error);
    throw new Error(error.message || "Không kết nối được tới server");
  }
};

export const addFavoriteProduct = async (token, productId) => {
  try {
    const res = await fetch(`${API_URL}/api/v1/users/favorites`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Không thêm được sản phẩm yêu thích");
    }

    return data;
  } catch (error) {
    console.error(error);
    throw new Error(error.message || "Không kết nối được tới server");
  }
};

export const removeFavoriteProduct = async (token, productId) => {
  try {
    const res = await fetch(`${API_URL}/api/v1/users/favorites/${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Không xóa được sản phẩm yêu thích");
    }

    return data;
  } catch (error) {
    console.error(error);
    throw new Error(error.message || "Không kết nối được tới server");
  }
};


//Admin

export const getUsers = async (token, role = "all") => {
  try {
    const url =
      role === "all"
        ? `${API_URL}/api/v1/users`
        : `${API_URL}/api/v1/users?role=${encodeURIComponent(role)}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Không lấy được danh sách user");
    }

    return data;
  } catch (error) {
    console.error("getUsers error:", error);
    throw new Error(error.message || "Không kết nối được tới server");
  }
};
export const createUser = async (data, token) => {
  try {
    // Kiểm tra dữ liệu đầu vào cơ bản
    if (!data.username || !data.password || !data.email) {
      throw new Error("Thiếu thông tin bắt buộc (username, password, email)");
    }

    const res = await fetch(`${API_URL}/api/v1/users/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Không tạo được người dùng");
    return result;
  } catch (err) {
    console.error("❌ createUser error:", err);
    throw err;
  }
};


export const updateUser = async (id, payload, token) => {
  const res = await fetch(`${API_URL}/api/v1/users/update/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Có lỗi khi cập nhật user");
  }
  const data = await res.json();
  return data.user; 
};


export const deleteUser = async (id, token) => {
  const res = await fetch(`${API_URL}/api/v1/users/delete/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Không xóa được người dùng");
};


export const toggleUserStatus = async (id, token) => {
  const res = await fetch(`${API_URL}/api/v1/users/${id}/toggle-status`, {
    method: "put",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Không thể cập nhật trạng thái");
  return data.status; 
};
