import express from "express";
import {
  SignUp,
  login,
  logout,
  getProfile,
  updateProfile,
  deleteProfile,
  changePassword,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import { authorize, protect } from "../middleware/auth.Middleware.js";

const router = express.Router();

router.post("/signup", SignUp);
router.post("/login", login);
router.post("/logout", protect, logout);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.delete("/profile", protect, deleteProfile);
router.post("/change-password", protect, changePassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
