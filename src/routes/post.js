import { Router } from "express";
import controller from "../controllers/posts.js";
import checks from "../middleware/checks.js";

const router = Router();

router.get("/", controller.getAll);
// anyone can do get but only the admin can do a post
router.post("/", checks.loggedIn, controller.add);
// router.put("/posts/:id", controller.update);
// router.delete("/posts/:id", controller.delete);

export default router;
