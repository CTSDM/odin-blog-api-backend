import { Router } from "express";
import checks from "../middleware/checks.js";
import controller from "../controllers/comments.js";

const router = Router();

router.post("/", checks.isLoggedIn, controller.add);
router.delete("/", checks.isLoggedIn, checks.isAdmin, controller.remove);

export default router;
