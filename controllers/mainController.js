import axios from "axios";
import pool  from '../db.js';

export default {
    home: async (req,res)=>{
        try {
            const response = await axios.get("https://uselessfacts.jsph.pl/api/v2/facts/random?language=en");
            const funFact = response.data.text;
                const result = await pool.query("SELECT * FROM total_points ORDER BY total_points DESC");
                const leaderboard = result.rows;

            res.render("index", {funFact, leaderboard});
        } catch (err) {
            console.error("Error fetching fun fact:", err.message);
            let leaderboard = [];
            res.render("index", { funFact: "Couldn't fetch a fun fact today 😭",
                leaderboard
            });
        }
    },
    discussion: (req, res) => {
        res.render("discussion");
    },
    communityPage: (req, res) => {
        res.render("community");
    },
    about: (req, res) => {
        res.render("about");
    }
}
