import pool from '../db.js';
import bcrypt from "bcrypt";
import passport from "passport";

const saltRounds = 10;

export default {
  signup: async (req, res) => {
    const { username, password } = req.body;
    try {
      const existingUser = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
      if (existingUser.rows.length > 0) {
        req.flash("error_msg", "Username already exists");
        return res.redirect("/to_signup");
      }

      const salt = await bcrypt.genSalt(saltRounds);
      const password_hash = await bcrypt.hash(password, salt);
      const result = await pool.query(
        "INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING *",
        [username, password_hash]
      );

      const user = result.rows[0];
      req.login(user, (err) => {
        if (err) {
          req.flash("error_msg", "Login after signup failed");
          return res.redirect("/to_signup");
        }
        req.flash("success_msg", "Signup successful! Welcome!");
        return res.redirect("/");
      });
    } catch (error) {
      console.error(error);
      req.flash("error_msg", "Server error, please try again later");
      return res.redirect("/to_signup");
    }
  },
  login: (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        req.flash("error_msg", info?.message || "Invalid credentials");
        return res.redirect("/to_login");
      }
      req.logIn(user, (err) => {
        if (err) return next(err);
        req.flash("success_msg", "Login successful! Welcome back.");
        return res.redirect("/");
      });
    })(req, res, next);
  },
  to_login: (req, res) =>{
    res.render("login-signup", {
      title: "Login",
      alternative: "to_signup",
      altText: "Don't have an account yet?",
      action: "/login",
      alt: "Signup"
    });
  },
  to_signup: (req, res) =>{
    res.render("login-signup", {
      title: "Signup",
      alternative: "to_login",
      altText: "Already have an account?",
      action: "/signup",
      alt: "login"
    });
  }
};
