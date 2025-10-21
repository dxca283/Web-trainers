// apiHelper.js
export const handleResponse = async (res) => {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const message = errorData.message || "Lỗi xảy ra";
    const error = new Error(message);
    error.status = res.status;
    throw error;
  }
  return res.json();
};
