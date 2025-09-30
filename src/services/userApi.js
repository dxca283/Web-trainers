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
