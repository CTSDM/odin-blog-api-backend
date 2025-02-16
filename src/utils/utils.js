import bcrypt from "bcryptjs";
import db from "../db/queries.js";
import cloudinary from "../../config/cloudinary.js";
import { env } from "../../config/config.js";

async function checkUsernamePassword(userCredentials, res) {
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
        return res.status(500);
    }
}

function sendUserToClient(req, res) {
    req.userDataToClient = {
        username: req.user.username,
        is_admin: req.user["is_admin"],
        id: req.user.id,
        profileSrc: req.user["profile_src"],
    };
    res.status(200).json({ ...req.userDataToClient, data: "logged in" });
}

// We fetch the  cloudinary server
// if something wrong happens, we return a backup url
// otherwise we return a single url
async function getRandomProfile() {
    const response = await cloudinary.api.resources_by_asset_folder(
        env.cloudinary.folder,
        function (error, result) {
            if (error) {
                console.log(error);
                return env.profiles.backup;
            }
        },
    );
    const arrLinks = response.resources.map((obj) => obj.url);
    return arrLinks[Math.floor(Math.random() * arrLinks.length)];
}

export { checkUsernamePassword, getRandomProfile, sendUserToClient };
