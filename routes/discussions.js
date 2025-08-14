import express from "express";
import pool from "../db.js";

const router = express.Router();

// GET all discussions
router.get("/", async (req, res) => {
  try {
    const discussionsResult = await pool.query(
      "SELECT id, title FROM discussions ORDER BY created_at DESC"
    );

    const messagesResult = await pool.query(
      "SELECT discussion_id, message FROM discussion_messages ORDER BY created_at ASC"
    );

    const discussions = discussionsResult.rows.map(discussion => ({
      ...discussion,
      messages: messagesResult.rows
        .filter(msg => msg.discussion_id === discussion.id)
        .map(msg => msg.message)
    }));

    res.render("discussions", { discussions });
  } catch (err) {
    console.error("Error fetching discussions:", err);
    res.status(500).send("Server error");
  }
});

// POST: Start a new discussion
router.post("/start", express.json(), async (req, res) => {
  const { title, message } = req.body;

  if (!title || !message) {
    return res.status(400).json({ error: "Title and message are required" });
  }

  try {
    // 1. Insert discussion
    const result = await pool.query(
      "INSERT INTO discussions (title) VALUES ($1) RETURNING id",
      [title]
    );
    const discussionId = result.rows[0].id;

    // 2. Insert first message
    await pool.query(
      "INSERT INTO discussion_messages (discussion_id, message) VALUES ($1, $2)",
      [discussionId, message]
    );

    res.json({ success: true, discussion_id: discussionId });
  } catch (err) {
    console.error("Error starting discussion:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST: Add a reply
router.post("/reply", express.json(), async (req, res) => {
  const { discussion_id, message } = req.body;

  if (!discussion_id || !message) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    await pool.query(
      "INSERT INTO discussion_messages (discussion_id, message) VALUES ($1, $2)",
      [discussion_id, message]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Error adding reply:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
