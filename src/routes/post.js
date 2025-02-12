import { Router } from "express";
import controller from "../controllers/posts.js";
import checks from "../middleware/checks.js";
import jwt from "../../config/jwt.js";

const router = Router();

// users can only get visible posts
router.get("/", controller.getVisiblePosts);
// admins can view, edit, create or delete all posts.
router.get("/admin/complete", jwt.auth, checks.isAdmin, controller.getAll);
// if the post is visible is returned without auth the user
router.get("/:id", controller.get, jwt.auth, checks.isAdmin, (req, res) =>
    res.status(200).json(req.payload),
);
router.put("/:id", jwt.auth, checks.isAdmin, controller.update);
router.post("/", jwt.auth, checks.isAdmin, controller.add);
router.delete("/:id", jwt.auth, checks.isAdmin, controller.remove);

export default router;
