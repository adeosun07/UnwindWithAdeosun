import express from 'express';
import router from './routes/index.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import quizRouter from "./routes/quiz.js";
import scoreRoutes from "./routes/score.js";

import communityRoutes from "./routes/community.js";
import discussionsRouter from "./routes/discussions.js";
import { deleteOldDiscussions } from "./cleanup.js";
import emojiRoutes from "./routes/emoji-riddle.js";
import normalRoutes from "./routes/normal-riddles.js";
import anagramRouter from "./routes/anagram.js";

import session from 'express-session';
import passport from 'passport';
import flash from 'connect-flash';
import initializePassport from './passportConfig.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 47708;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());

initializePassport();
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
    }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user;
  next();
});
export function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error_msg", "Please log in to view that page");
  res.redirect("/to_login");
}


app.use("/api/community", communityRoutes);
app.use("/discussions", discussionsRouter);
app.use("/emoji-riddle", emojiRoutes);
app.use("/normal-riddle", normalRoutes);
app.use("/quiz", quizRouter);
app.use("/scores", scoreRoutes);
app.use("/word-anagram", anagramRouter);

deleteOldDiscussions();
setInterval(deleteOldDiscussions, 24 * 60 * 60 * 1000);

app.use('/', router); 
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});