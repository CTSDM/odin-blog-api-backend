import passport from "passport";
import { Strategy as JwtStrategy } from "passport-jwt";
import db from "../src/db/queries.js";
import { env } from "../config/config.js";

const errLoginMessage = "Incorrect username or password";

function cookieExtractor(req) {
    // We either return a string with the JWT token or null
    if (req && req.cookies) {
        return req.cookies["access-token"];
    } else {
        return null;
    }
}

const opts = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: env.keyAccessToken,
};

passport.use(
    new JwtStrategy(opts, async function (jwt_payload, done) {
        // if the payload is the one i have sent from this server with my access-token env key
        // then i know that all the parameters will simply work
        // we check to make sure that the user still exists
        const username = jwt_payload.username;
        const userFromDB = db.getUser("username", username);
        if (userFromDB) {
            return done(null, jwt_payload);
        } else {
            return done(null, false, { msg: errLoginMessage });
        }
    }),
);
