import express from "express";
import pool from "../db.js";

const router = express.Router();
router.get("/:category", async (req, res) => {
    try {
        const category = req.params.category;
        const result = await pool.query(
            "SELECT * FROM shoutouts WHERE category = $1 ORDER BY created_at DESC",
            [category]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

router.post("/", async (req, res) => {
    try {
        const { category, message } = req.body;
        if (!message || !category) {
            return res.status(400).json({ error: "Message is required" });
        }
        await pool.query(
            "INSERT INTO shoutouts (category, message) VALUES ($1, $2)",
            [category, message]
        );
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to add message" });
    }
});

export default router;
