import express from 'express';
import mainController from '../controllers/mainController.js';
import authController from '../controllers/authController.js';
import {ensureAuthenticated} from "../server.js"
import { getJoke, renderJoke } from "../controllers/jokesControllers.js";

const router = express.Router();
console.log(ensureAuthenticated);
console.log(mainController.communityPage);

router.get('/', mainController.home);
router.get('/to_login', authController.to_login);
router.get('/to_signup', authController.to_signup);
router.get('/discussions', mainController.discussion);
router.get("/jokes", ensureAuthenticated, renderJoke);
router.get("/joke/next", getJoke);
router.get('/community', ensureAuthenticated, mainController.communityPage);
router.get('/about', mainController.about);
router.get("/games", ensureAuthenticated, mainController.games);

router.post("/signup", authController.signup);
router.post("/login", authController.login);


export default router;