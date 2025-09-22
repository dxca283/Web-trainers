import { Client, TablesDB , ID, Query } from "appwrite";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;

const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID);

const databases = new TablesDB (client);

export const updateSearchCount = async (searchTerm, product) => {
  try {
    const result = await databases.listRows(DATABASE_ID, COLLECTION_ID, [
      Query.equal("searchTerm", searchTerm),
    ]);

    if (result.rows.length > 0) {
      const row = result.rows[0];

      await databases.updateRow(DATABASE_ID, COLLECTION_ID, row.$id, {
        count: row.count + 1,
      });
    } else {
      await databases.createRow(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm: searchTerm,
        count: 1,
        product_id: product.id,
        prod_img: product.thumbnail || "https://via.placeholder.com/150",
      });
    }
  } catch (error) {
    console.error("Error updating search count:", error);
  }
};

export const getHotProducts = async () => {
    try {
        const result = await databases.listRows(DATABASE_ID, COLLECTION_ID, [
            Query.orderDesc("count"),
            Query.limit(5),
        ]);
        return result.rows;
    } catch (error) {
        console.error("Error fetching hot products:", error);
    }
}