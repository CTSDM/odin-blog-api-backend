import { Router } from "express";
import controller from "../controllers/user.js";
import checks from "../middleware/checks.js";
import jwt from "../../config/jwt.js";

const router = Router();

router.get("/", jwt.auth, (req, res) =>
    res.status(200).json({ username: req.user.username, data: "logged in" }),
);
router.post("/", controller.login);
router.get("/admin", jwt.auth, checks.isAdmin, (_, res) => res.sendStatus(200));
router.post("/admin", controller.login, checks.isAdmin, (_, res) => res.sendStatus(200));

export default router;
