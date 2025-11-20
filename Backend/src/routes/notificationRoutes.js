import express from "express";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../controllers/notificationController.js";
import { authorize, protect } from "../middleware/auth.Middleware.js"; // make sure you have auth

const router = express.Router();

// Protect all notification routes
router.use(protect);

router.get("/", protect, getNotifications);
router.patch("/:id/read", protect, markNotificationAsRead);
router.patch("/mark-all-read", protect, markAllNotificationsAsRead);

export default router;
