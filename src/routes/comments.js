import { Router } from "express";
import checks from "../middleware/checks.js";
import controller from "../controllers/comments.js";
import jwt from "../../config/jwt.js";

const router = Router();

router.post("/", jwt.auth, controller.add);
router.delete("/", jwt.auth, controller.remove);

export default router;
