import express from "express";
import pool from "../db.js";

const router = express.Router();

router.post("/save-score", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).send("You must be logged in to save scores");
  }

  const username = req.user.username;
  const { game, points } = req.body;

  const validGames = {
    emoji_riddle: "emoji_riddle_points",
    quiz: "quiz_points",
    normal_riddle: "normal_riddle_points",
    rps: "rps_points",
    word_anagram: "word_anagram_points",
  };

  if (!validGames[game]) {
    return res.status(400).send("Invalid game");
  }

  try {
    // get current score
    const getScore = await pool.query(
      `SELECT * FROM ${validGames[game]} WHERE username = $1`,
      [username]
    );

    const userScore = getScore.rows[0]?.points || 0;

    // only update if new score is higher
    if (userScore >= points) {
      return res.status(200).send("Score not updated (lower than current)");
    }

    // insert or update
    const query = `
      INSERT INTO ${validGames[game]} (username, points)
      VALUES ($1, $2)
      ON CONFLICT (username)
      DO UPDATE SET points = EXCLUDED.points
    `;

    await pool.query(query, [username, points]);

    res.status(200).send("Score saved");
  } catch (err) {
    console.error("Error saving score:", err.message);
    res.status(500).send("Server error saving score");
  }
});

export default router;
