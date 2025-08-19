import axios from "axios";
import pool from "../db.js";

export default {
  home: async (req, res) => {
    try {
      const response = await axios.get(
        "https://uselessfacts.jsph.pl/api/v2/facts/random?language=en"
      );
      const funFact = response.data.text;
      const result = await pool.query(
        "SELECT * FROM total_points ORDER BY total_points DESC"
      );
      const leaderboard = result.rows;

      res.render("index", { funFact, leaderboard });
    } catch (err) {
      console.error("Error fetching fun fact:", err.message);
      let leaderboard = [];
      res.render("index", {
        funFact: "Couldn't fetch a fun fact today 😭",
        leaderboard,
      });
    }
  },
  discussion: (req, res) => {
    res.render("discussions");
  },
  communityPage: (req, res) => {
    res.render("community");
  },
  about: (req, res) => {
    res.render("about");
  },
  games: (req, res) => {
    res.render("games");
  },
  get_emoji_riddle: async (req, res) => {
    try {
      const result = await pool.query(
        "SELECT * FROM emoji_riddles ORDER BY RANDOM()"
      );
      res.json(result.rows); 
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  },
  emoji_riddle: (req, res) => {
    res.render("emoji-riddle"); 
  },
  quiz: (req, res) => {
    res.render("quiz"); 
  },
  normal_riddle: (req,res) =>{
    res.render("normal-riddle")
  },
  get_normal_riddle: async (req,res) =>{
    try {
      const result = await axios.get("https://opentdb.com/api.php?amount=30&type=multiple");
      res.json(result.data);
    } catch (error) {
      console.log(error);
    }
  },
  rps: (req, res) => {
    res.render("rps"); 
  },
  anagram: (req, res) => {
    res.render("word-anagram");
  },
};
