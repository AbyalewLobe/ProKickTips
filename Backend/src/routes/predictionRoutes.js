import express from "express";
import {
  getAllPredictions,
  getPredictionById,
  deletePrediction,
  updatePredictionStatus,
  createPrediction,
  getPredictionsHistory,
  getTodayFreePredictions,
} from "../controllers/predictionController.js";
import { protect, authorize } from "../middleware/auth.Middleware.js";

const router = express.Router();

router.post("/", protect, authorize("admin"), createPrediction);
router.get("/", protect, getAllPredictions);
// User-specific list (authenticated users)
router.get("/history", getPredictionsHistory);
router.get("/today-free", getTodayFreePredictions);
router.get("/:id", protect, authorize("admin"), getPredictionById);
router.delete("/:id", protect, authorize("admin"), deletePrediction);
router.put("/:id/status", protect, authorize("admin"), updatePredictionStatus);

export default router;
