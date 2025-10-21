import { Client, TablesDB, ID, Query } from "appwrite";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;

const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID);
const databases = new TablesDB(client);

// Cập nhật số lần tìm kiếm cho sản phẩm cụ thể
export const updateSearchCount = async (searchTerm, product) => {
  try {
    // Check xem đã có row cho cặp searchTerm + product chưa
    const result = await databases.listRows(DATABASE_ID, COLLECTION_ID, [
      Query.equal("searchTerm", searchTerm),
      Query.equal("product_id", product.id),
    ]);

    if (result.rows.length > 0) {
      // Nếu có rồi thì tăng count
      const row = result.rows[0];
      await databases.updateRow(DATABASE_ID, COLLECTION_ID, row.$id, {
        count: row.count + 1,
      });
    } else {
      // Nếu chưa có thì tạo mới
      await databases.createRow(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm,
        count: 1,
        product_id: product.id,
        product_name: product.name,
        prod_img: product.thumbnail || "https://via.placeholder.com/150",
      });
    }
  } catch (error) {
    console.error("Error updating search count:", error);
  }
};

// Lấy hot products (không trùng sản phẩm)
export const getHotProducts = async () => {
  try {
    const result = await databases.listRows(DATABASE_ID, COLLECTION_ID, [
      Query.orderDesc("count"),
      Query.limit(50), // lấy nhiều row để lọc trùng
    ]);

    const seen = new Set();
    const hot = [];
    for (const row of result.rows) {
      if (!seen.has(row.product_id)) {
        seen.add(row.product_id);
        hot.push(row);
      }
      if (hot.length >= 5) break; // chỉ lấy top 5 hot products
    }

    return hot;
  } catch (error) {
    console.error("Error fetching hot products:", error);
  }
};
