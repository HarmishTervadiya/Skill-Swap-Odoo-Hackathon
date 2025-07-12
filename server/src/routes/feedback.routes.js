import { Router } from "express";
import {
  createFeedback,
  getUserFeedback,
  updateFeedback,
  deleteFeedback,
  getAllFeedback,
  getFeedbackStats,
  getUserFeedbackSummary,
} from "../controllers/feedback.controller.js";
import {
  authenticateUser,
  authenticateAdmin,
} from "../middlewares/auth.middleware.js";

const router = Router();

// Feedback management routes
router.post("/", authenticateUser, createFeedback);
router.get("/user/:userId", getUserFeedback);
router.patch("/:feedbackId", authenticateUser, updateFeedback);
router.delete("/:feedbackId", authenticateUser, deleteFeedback);

// User feedback routes
router.get("/user/:userId/summary", getUserFeedbackSummary);

// Admin routes
router.get("/admin/all", authenticateAdmin, getAllFeedback);
router.get("/admin/stats", authenticateAdmin, getFeedbackStats);

export default router;
