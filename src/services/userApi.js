const API_URL = "http://localhost:5500/api/v1/users";

export const getUserProfile = async (token) => {
  const res = await fetch(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Không lấy được profile");
  return res.json();
};

export const updateUserProfile = async (token, userData) => {
  const res = await fetch(`${API_URL}/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });
  if (!res.ok) throw new Error("Không cập nhật được profile");
  return res.json();
};
