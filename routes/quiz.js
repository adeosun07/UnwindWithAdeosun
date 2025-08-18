import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/questions", async (req, res) => {
  try {
    const apiUrl = "https://opentdb.com/api.php?amount=5&type=multiple";
    const response = await axios.get(apiUrl);
    const data = response.data;

    res.json(data.results);
  } catch (err) {
    console.error("Error fetching quiz questions:", err);
    res.status(500).json({ error: "Failed to fetch quiz questions" });
  }
});

export default router;
