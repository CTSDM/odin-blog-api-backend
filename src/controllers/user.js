import db from "../db/queries.js";
import bcrypt from "bcryptjs";
import passport from "passport";
import { env } from "../../config/config.js";

async function add(req, res) {
    const newUser = {};
    // We check if the request contains an admin code and if it is correct
    // If it doesn't contain the admin code we try to create an user
    // If it tries to create an admin the adminCode must be correct, otherwise we throw 401
    let adminCode = req.body.adminCode;
    if (adminCode && adminCode !== env.adminCode) return res.sendStatus(401);
    newUser.admin = !!adminCode;

    const username = await db.getUser("username", req.body.username);
    if (username === null) {
        newUser.username = req.body.username;
        newUser.pw = await bcrypt.hash(req.body.password, 10);
        const userDB = await db.createUser(newUser);
        const response = { username: newUser.username };
        if (newUser.admin) response.admin = true;
        return res.json(response);
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
