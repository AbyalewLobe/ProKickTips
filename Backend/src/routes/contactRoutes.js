import express from "express";
import {
  getAllContacts,
  getContactById,
  createContact,
  deleteContact,
  markContactAsRead,
} from "../controllers/contactController.js";
import { protect, authorize } from "../middleware/auth.Middleware.js";

const router = express.Router();

router.get("/", protect, authorize("admin"), getAllContacts);
router.post("/", createContact);
router.get("/:id", protect, authorize("admin"), getContactById);
router.delete("/:id", protect, authorize("admin"), deleteContact);
router.put("/:id/read", protect, authorize("admin"), markContactAsRead);

export default router;
