import { Router } from "express";
import controller from "../controllers/posts.js";
import checks from "../middleware/checks.js";

const router = Router();

router.get("/", controller.getVisiblePosts);
router.get("/complete", checks.isLoggedIn, checks.isAdmin, controller.getAll);
router.get("/:id", controller.get);
router.put("/:id", checks.isLoggedIn, checks.isAdmin, controller.update);
// anyone can do get but only the admin can do a post
router.post("/", checks.isLoggedIn, checks.isAdmin, controller.add);
// router.put("/posts/:id", controller.update);
// router.delete("/posts/:id", controller.delete);

export default router;
