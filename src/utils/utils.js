import bcrypt from "bcryptjs";
import db from "../db/queries.js";

async function checkUsernamePassword(userCredentials) {
    try {
        const user = await db.getUser("username", userCredentials.username);
        if (!user) {
            return false;
        }
        const match = await bcrypt.compare(userCredentials.password, user.password);
        if (!match) {
            return false;
        }
        return user;
    } catch (err) {
        console.log(err);
        return res.status(500);
    }
}

function sendUserToClient(req, res) {
    req.userDataToClient = {
        username: req.user.username,
        is_admin: req.user["is_admin"],
        id: req.user.id,
    };
    res.status(200).json({ ...req.userDataToClient, data: "logged in" });
}

export { checkUsernamePassword, sendUserToClient };
