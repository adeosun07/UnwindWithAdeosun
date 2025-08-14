import pool from "./db.js";

export async function deleteOldDiscussions() {
  try {
    const result = await pool.query(
      "DELETE FROM discussions WHERE created_at < NOW() - INTERVAL '7 days'"
    );
    if (result.rowCount > 0) {
      console.log(`🗑 Deleted ${result.rowCount} old discussions`);
    }
  } catch (err) {
    console.error("Error deleting old discussions:", err);
  }
}
