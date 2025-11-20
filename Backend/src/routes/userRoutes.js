import express from "express";
import {
  getUsers,
  getUserById,
  deleteUser,
  changeUserAccess,
} from "../controllers/userController.js";
import { protect, authorize } from "../middleware/auth.Middleware.js";

const router = express.Router();

router.get("/", protect, authorize("admin"), getUsers);
router.get("/:id", protect, authorize("admin"), getUserById);
router.delete("/:id", protect, authorize("admin"), deleteUser);
router.put("/:id/access", protect, authorize("admin"), changeUserAccess);

export default router;
