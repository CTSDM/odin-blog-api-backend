import jwt from "jsonwebtoken";
import { env } from "../config/config.js";
import db from "../src/db/queries.js";
import passport from "passport";

const auth = (req, res, next) => {
    passport.authenticate(
        "jwt",
        {
            session: false,
        },
        async (err, user, _) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ msg: "something went wrong" });
            }
            if (user) {
                req.user = user;
                next();
            } else {
                try {
                    // we first check if the refresh token does exit
                    if (!(await checkRefreshToken(req))) {
                        return res.status(401).json({ data: "not an ape" });
                    }
                    createAccessToken(req, res);
                    next();
                } catch (err) {
                    console.log(err);
                    return res.status(401).json({ data: "NOT AN APE" });
                }
            }
        },
    )(req, res, next);
};

async function checkRefreshToken(req) {
    const token = req.cookies["refresh-token"];
    if (!token) {
        return false;
    }
    const tokenDB = token ? await db.getToken(token) : null;
    if (tokenDB === null) {
        return false;
    }
    try {
        const payload = jwt.verify(token, env.keyRefreshToken);
        req.user = { username: payload.username, is_admin: payload["is_admin"] };
        return true;
    } catch (err) {
        try {
            await db.deleteToken(token);
        } catch (err) {
            if (err.meta && err.meta.cause !== "Record to delete does not exist.") {
                console.log(err);
            }
        } finally {
            return false;
        }
    }
}

// We generate a refresh token with a longer validity
// This token is stored in the database
async function createRefreshToken(req, res) {
    const expiration = 60 * 60 * 24 * 180; // 180 days
    const token = signToken(req, env.keyRefreshToken, { expiresIn: expiration });
    try {
        await db.createToken(token, req.user.id);
    } catch (err) {
        console.log(err);
    }
    return res.cookie("refresh-token", token, env.cookieOptions);
}

// we sign the token after we verify that the use is in fact in our database
// we attach the access token
function createAccessToken(req, res) {
    const expiration = 60 * 3; // 3 minutes
    const token = signToken(req, env.keyAccessToken, { expiresIn: expiration });
    return res.cookie("access-token", token, env.cookieOptions);
}

function signToken(req, key, options) {
    const payload = { username: req.user.username, is_admin: req.user["is_admin"] };
    return jwt.sign(payload, key, options);
}

async function createTokens(req, res, next) {
    await createRefreshToken(req, res);
    createAccessToken(req, res);
    next();
}

export default { auth, createTokens };
