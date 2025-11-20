import express from "express";
import {
  createBlogPost,
  getAllBlogPosts,
  getBlogPostById,
  deleteBlogPost,
  updateBlogPost,
} from "../controllers/blogController.js";
import { protect, authorize } from "../middleware/auth.Middleware.js";

const router = express.Router();

// Define blog routes here

router.post("/", protect, authorize("admin"), createBlogPost);
router.get("/", getAllBlogPosts);
router.get("/:id", getBlogPostById);
router.delete("/:id", protect, authorize("admin"), deleteBlogPost);
router.put("/:id", protect, authorize("admin"), updateBlogPost);

export default router;
