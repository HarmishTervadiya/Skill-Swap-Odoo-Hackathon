import { Router } from "express";
import {
  getUserNotifications,
  markNotificationAsRead,
  deleteNotification,
  getUnreadCount,
  createPlatformNotification,
  getAllNotifications,
  updateNotification,
  deleteNotificationAdmin,
  getNotificationStats,
  bulkDeleteNotifications,
  deactivateExpiredNotifications,
} from "../controllers/notification.controller.js";
import {
  authenticateUser,
  authenticateAdmin,
} from "../middlewares/auth.middleware.js";

const router = Router();

// User notification routes (authenticated - only user can access their notifications)
router.get("/", authenticateUser, getUserNotifications);
router.get("/unread-count", authenticateUser, getUnreadCount); // Must come before parameterized routes
router.patch("/:notificationId/read", authenticateUser, markNotificationAsRead);
router.delete("/:notificationId", authenticateUser, deleteNotification);

// Admin routes (admin auth required)
router.post("/admin/platform", authenticateAdmin, createPlatformNotification);
router.get("/admin/all", authenticateAdmin, getAllNotifications);
router.patch("/admin/:notificationId", authenticateAdmin, updateNotification);
router.delete(
  "/admin/:notificationId",
  authenticateAdmin,
  deleteNotificationAdmin
);
router.get("/admin/stats", authenticateAdmin, getNotificationStats);
router.delete("/admin/bulk", authenticateAdmin, bulkDeleteNotifications);
router.patch(
  "/admin/deactivate-expired",
  authenticateAdmin,
  deactivateExpiredNotifications
);

export default router;
