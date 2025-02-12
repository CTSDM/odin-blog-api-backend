import { checkUsernamePassword } from "../utils/utils.js";

function isAdmin(req, res, next) {
    if (req.user["is_admin"]) {
        next();
    } else {
        return res.status(401).json({ msg: "Unauthorized." });
    }
}

async function isUser(req, res, next) {
    const userCredentials = { username: req.body.username, password: req.body.password };
    const user = await checkUsernamePassword(userCredentials);
    if (user) {
        req.user = { ...user, password: "_" };
        next();
    } else {
        return res.status(401).json({ msg: "Unathorized." });
    }
}

export default { isAdmin, isUser };
