import db from "../db/queries.js";
import bcrypt from "bcryptjs";
import { env } from "../../config/config.js";
import validation from "../middleware/validation.js";
import jwt from "../../config/jwt.js";
import checks from "../middleware/checks.js";
import { getRandomProfile } from "../utils/utils.js";

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
        newUser.username = req.body.username;
        newUser.pw = await bcrypt.hash(req.body.password, 10);
        // The admin will have a special profile logo
        newUser.profileSrc = newUser.admin ? env.profiles.admin : await getRandomProfile();
        const userDB = await db.createUser(newUser);
        if (!userDB) {
            return res.sendStatus(400);
        }
        const response = { username: newUser.username };
        if (newUser.admin) response.admin = true;
        return res.json(response);
    },
];

const login = [validation.login, validation.checkErrors, checks.isUser, jwt.createTokens];

const loginAdmin = [
    validation.login,
    validation.checkErrors,
    checks.isUser,
    checks.isAdmin,
    jwt.createTokens,
];

// Delete the jwt token and the refresh cookie in case they exist
function logout(req, res) {
    if (req.cookies["access-token"]) {
        res.clearCookie("access-token", env.cookie.options);
    }
    if (req.cookies["refresh-token"]) {
        res.clearCookie("refresh-token", env.cookie.options);
    }
    return res.sendStatus(205);
}

export default { add, login, loginAdmin, logout };
