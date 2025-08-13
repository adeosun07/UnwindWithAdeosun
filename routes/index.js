import express from 'express';
import mainController from '../controllers/mainController.js';
import authController from '../controllers/authController.js';
import passport from 'passport';
import {ensureAuthenticated} from "../server.js"

const router = express.Router();
console.log(ensureAuthenticated);
console.log(mainController.communityPage);

router.get('/', mainController.home);
router.get('/to_login', authController.to_login);
router.get('/to_signup', authController.to_signup);
router.get('/discussion', mainController.discussion);
router.get('/community', ensureAuthenticated, mainController.communityPage);
router.post("/signup", authController.signup);
router.post("/login", authController.login);


export default router;