import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
import pool from "./db.js";

export default function initializePassport() {
    passport.use(new Strategy( 
        async function verify(username, password, done) {
            try {
                const existingUser = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
                if(existingUser.rows.length > 0){
                    const user = existingUser.rows[0];
                    bcrypt.compare(password, user.password_hash, (err, result) =>{
                        if (err){
                            return done(err);
                        }else{
                            if(result){
                                return done(null, user);
                            }else{
                                return done(null, false, { message: "Incorrect username or password" });
                            }
                        }
                    }); 
                } else{
                    return done(null, false, { message: "User not Found. Please signup" });
                };  
            } catch (error) {
                console.error(error);
            }
    }));


    passport.serializeUser((user, done) => {
    done(null, user.username);
    });

    passport.deserializeUser(async (username, done) => {
    try {
        const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
        done(null, result.rows[0]);
    } catch (err) {
        done(err);
    }
    });
}