import express from "express";
import {ensureAuthenticated} from "../server.js"
import mainController from "../controllers/mainController.js";

const router = express.Router();

router.get("/", ensureAuthenticated,mainController.normal_riddle);
router.get("/api/riddles", mainController.get_normal_riddle);

export default router;