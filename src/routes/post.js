import { Router } from "express";
import controller from "../controllers/posts.js";
import checks from "../middleware/checks.js";

const router = Router();

// users can only get visible posts
router.get("/", controller.getVisiblePosts);
// admins can view, edit, create or delete all posts.
router.get("/admin/complete", checks.isLoggedIn, checks.isAdmin, controller.getAll);
router.get("/:id", controller.get);
router.put("/:id", checks.isLoggedIn, checks.isAdmin, controller.update);
router.post("/", checks.isLoggedIn, checks.isAdmin, controller.add);
router.delete("/:id", checks.isLoggedIn, checks.isAdmin, controller.remove);

export default router;
