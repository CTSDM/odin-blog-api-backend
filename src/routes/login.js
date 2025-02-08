import { Router } from "express";
import controller from "../controllers/user.js";
import checks from "../middleware/checks.js";

const router = Router();

router.get("/", checks.isLoggedIn, (req, res) =>
    res.status(200).json({ username: req.user.username, data: "logged in" }),
);
router.post("/", controller.login, (req, res) =>
    res.status(200).json({ username: req.user.username, data: "WELCOME BACK APE" }),
);
router.get("/admin", checks.isLoggedIn, checks.isAdmin, (_, res) => res.sendStatus(200));
router.post("/admin", controller.login, checks.isAdmin, (_, res) => res.sendStatus(200));

export default router;
