import { Router } from "express";
import controller from "../controllers/user.js";
import checks from "../middleware/checks.js";
import jwt from "../../config/jwt.js";
import { sendUserToClient } from "../utils/utils.js";

const router = Router();

router.get("/", jwt.auth, sendUserToClient);
router.post("/", controller.login, sendUserToClient);
router.get("/admin", jwt.auth, checks.isAdmin, sendUserToClient);
router.post("/admin", controller.loginAdmin, sendUserToClient);

export default router;
