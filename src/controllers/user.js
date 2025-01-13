import db from "../db/queries.js";
import bcrypt from "bcryptjs";
// we can use passport after creating a new user to login automatically
// but since we have separated backend and frontend i think this can be handled in the front-end!
import passport from "passport";

async function add(req, res) {
    // check if the username is already in use
    const username = await db.getUser("username", req.body.username);
    if (username === null) {
        const newUser = {
            username: req.body.username,
        };
        newUser.pw = await bcrypt.hash(req.body.password, 10);
        const userDB = await db.createUser(newUser);
        return res.json({ username: newUser.username });
    } else {
        return res.sendStatus(400);
    }
}

function login(req, res) {
    passport.authenticate(
        "local",
        {
            failureMessage: true,
        },
        (err, user, info) => {
            if (user) {
                req.login(user, () =>
                    res.status(200).json({ data: "WELCOME BACK APE" }),
                );
            } else {
                return res.status(401).json({ data: "NOT AN APE" });
            }
        },
    )(req, res);
}

function logout(req, res, next) {
    if (req.user) {
        req.logout((err) => {
            if (err) return next(err);
            return res.sendStatus(205);
        });
    } else {
        return res.sendStatus(205);
    }
}

export default { add, login, logout };
