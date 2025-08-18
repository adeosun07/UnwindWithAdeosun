import express from "express";
import pool from "../db.js";

const router = express.Router();

router.post("/save-score", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).send("You must be logged in to save scores");
  }

  const username = req.user.username;
  const { game, points } = req.body;
  const getScore = await pool.query(
    "SELECT * FROM total_points WHERE username = $1",
    [username]
  );
  const userScore = getScore.rows[0].total_points;
  if(userScore > points) {
    return;
    } else{
        try {
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

    const query = `
      INSERT INTO ${validGames[game]} (username, points)
      VALUES ($1, $2)
      ON CONFLICT (username)
      DO UPDATE SET points = EXCLUDED.points
    `;

    await pool.query(query, [username, points]);

    res.status(200);
  } catch (err) {
    console.error("Error saving score:", err.message);
    res.status(500);
  }
    }
});

export default router;
