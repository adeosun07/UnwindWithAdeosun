import express from "express";
import {ensureAuthenticated} from "../server.js"
import mainController from "../controllers/mainController.js";

const router = express.Router();

router.get("/", ensureAuthenticated,mainController.emoji_riddle);  // Renders the EJS page
router.get("/api/riddles", mainController.get_emoji_riddle); // Returns riddles as JSON

export default router;
