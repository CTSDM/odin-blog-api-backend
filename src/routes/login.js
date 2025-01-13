import { Router } from "express";
import controller from "../controllers/user.js";
import checks from "../middleware/checks.js";

const router = Router();

router.get("/", checks.loggedIn, (_, res) => res.sendStatus(200));
router.post("/", controller.login);

export default router;
