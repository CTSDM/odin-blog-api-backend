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
        throw new Error(err);
    }
}

export { checkUsernamePassword };
