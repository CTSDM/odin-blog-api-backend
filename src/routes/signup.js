import { Router } from "express";
import controller from "../controllers/user.js";

const router = Router();

router.post("/", controller.add);

export default router;
