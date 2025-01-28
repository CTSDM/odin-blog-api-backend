import db from "../db/queries.js";
import bcrypt from "bcryptjs";
import passport from "passport";
import { env } from "../../config/config.js";
import validation from "../middleware/validation.js";

const add = [
    validation.signup,
    validation.checkErrors,
    async function (req, res) {
        const newUser = {};
        // We check if the request contains an admin code and if it is correct
        // If it doesn't contain the admin code we try to create an user
        // If it tries to create an admin the adminCode must be correct, otherwise we throw 401
        let adminCode = req.body.adminCode;
        if (adminCode && adminCode !== env.adminCode) return res.sendStatus(401);
        newUser.admin = !!adminCode;

        // we should add verification along the way...
        const username = await db.getUser("username", req.body.username);
        if (username === null) {
            newUser.username = req.body.username;
            newUser.pw = await bcrypt.hash(req.body.password, 10);
            const userDB = await db.createUser(newUser);
            if (!userDB) {
                return res.sendStatus(400);
            }
            const response = { username: newUser.username };
            if (newUser.admin) response.admin = true;
            return res.json(response);
        } else {
            return res.sendStatus(400);
        }
    },
];

const login = [
    validation.login,
    validation.checkErrors,
    function login(req, res, next) {
        passport.authenticate(
            "local",
            {
                failureMessage: true,
            },
            (err, user, info) => {
                if (user) {
                    req.login(user, () => {
                        next();
                    });
                } else {
                    return res.status(401).json({ data: "NOT AN APE" });
                }
            },
        )(req, res, next);
    },
];

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
