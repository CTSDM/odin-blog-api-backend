import passport from "passport";
import bcrypt from "bcryptjs";
import { Strategy as LocalStrategy } from "passport-local";
import db from "../src/db/queries.js";

const errLoginMessage = "Incorrect username or password";

passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const user = await db.getUser("username", username);
            if (!user) {
                return done(null, false, { message: errLoginMessage });
            }
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return done(null, false, { message: errLoginMessage });
            }
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }),
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await db.getUser("id", id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});
