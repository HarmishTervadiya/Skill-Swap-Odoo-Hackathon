import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getUserNotifications = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const { type, isActive } = req.query;

  let query = { recipient: userId };
  if (type) {
    query.type = type;
  }
  if (isActive !== undefined) {
    query.isActive = isActive === "true";
  }

  const notifications = await Notification.find(query)
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalNotifications = await Notification.countDocuments(query);
  const totalPages = Math.ceil(totalNotifications / limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        notifications,
        totalPages,
        currentPage: page,
        totalNotifications,
      },
      "Notifications retrieved successfully"
    )
  );
});

const markNotificationAsRead = asyncHandler(async (req, res) => {
  const { notificationId } = req.params;
  const userId = req.user._id;
  const notification = await Notification.findById(notificationId);
  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }
  if (
    notification.recipient?.toString() !== userId.toString() &&
    req.user.role !== "admin"
  ) {
    throw new ApiError(403, "You can only mark your own notifications as read");
  }
  notification.isActive = false;
  await notification.save();
  return res
    .status(200)
    .json(new ApiResponse(200, notification, "Notification marked as read"));
});

const deleteNotification = asyncHandler(async (req, res) => {
  const { notificationId } = req.params;
  const userId = req.user._id;
  const notification = await Notification.findById(notificationId);
  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }
  if (
    notification.recipient?.toString() !== userId.toString() &&
    req.user.role !== "admin"
  ) {
    throw new ApiError(403, "You can only delete notifications you received");
  }
  await Notification.findByIdAndDelete(notificationId);
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Notification deleted successfully"));
});

const getUnreadCount = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const unreadCount = await Notification.countDocuments({
    recipient: userId,
    isActive: true,
  });
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { unreadCount },
        "Unread count retrieved successfully"
      )
    );
});

const createPlatformNotification = asyncHandler(async (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    throw new ApiError(403, "Admin access required");
  }
  if (!req.body) {
    throw new ApiError(400, "Request body is required");
  }
  const { title, message, type, priority, expiresAt } = req.body;
  if (!title || !message) {
    throw new ApiError(400, "Title and message are required");
  }
  if (!["downtime_alerts", "feature_updates", "system"].includes(type)) {
    throw new ApiError(400, "Invalid notification type for platform messages");
  }
  const notification = await Notification.create({
    title,
    message,
    type,
    priority: priority || "medium",
    createdBy: req.user._id,
    expiresAt: expiresAt ? new Date(expiresAt) : null,
    isActive: true,
  });
  const populatedNotification = await Notification.findById(
    notification._id
  ).populate("createdBy", "name email");
  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        populatedNotification,
        "Platform notification created successfully"
      )
    );
});

const getAllNotifications = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    throw new ApiError(403, "Admin access required");
  }
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const { type, priority, isActive, search } = req.query;
  let query = {};
  if (type) {
    query.type = type;
  }
  if (priority) {
    query.priority = priority;
  }
  if (isActive !== undefined) {
    query.isActive = isActive === "true";
  }
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { message: { $regex: search, $options: "i" } },
    ];
  }
  const notifications = await Notification.find(query)
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  const totalNotifications = await Notification.countDocuments(query);
  const totalPages = Math.ceil(totalNotifications / limit);
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        notifications,
        totalPages,
        currentPage: page,
        totalNotifications,
      },
      "All notifications retrieved successfully"
    )
  );
});

// Admin: Update notification
const updateNotification = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    throw new ApiError(403, "Admin access required");
  }
  const { notificationId } = req.params;
  const { title, message, type, priority, isActive, expiresAt } = req.body;
  const notification = await Notification.findById(notificationId);
  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }
  const updatedNotification = await Notification.findByIdAndUpdate(
    notificationId,
    {
      $set: {
        title: title || notification.title,
        message: message || notification.message,
        type: type || notification.type,
        priority: priority || notification.priority,
        isActive: isActive !== undefined ? isActive : notification.isActive,
        expiresAt: expiresAt ? new Date(expiresAt) : notification.expiresAt,
      },
    },
    { new: true }
  ).populate("createdBy", "name email");
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedNotification,
        "Notification updated successfully"
      )
    );
});

// Admin: Delete notification
const deleteNotificationAdmin = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    throw new ApiError(403, "Admin access required");
  }
  const { notificationId } = req.params;
  const notification = await Notification.findById(notificationId);
  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }
  await Notification.findByIdAndDelete(notificationId);
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Notification deleted successfully"));
});

// Admin: Get notification statistics
const getNotificationStats = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    throw new ApiError(403, "Admin access required");
  }
  const totalNotifications = await Notification.countDocuments();
  const activeNotifications = await Notification.countDocuments({
    isActive: true,
  });
  const inactiveNotifications = await Notification.countDocuments({
    isActive: false,
  });
  // Get notifications by type
  const notificationsByType = await Notification.aggregate([
    {
      $group: {
        _id: "$type",
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
  ]);
  // Get notifications by priority
  const notificationsByPriority = await Notification.aggregate([
    {
      $group: {
        _id: "$priority",
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
  ]);
  // Get recent notifications (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentNotifications = await Notification.countDocuments({
    createdAt: { $gte: thirtyDaysAgo },
  });
  const stats = {
    total: totalNotifications,
    active: activeNotifications,
    inactive: inactiveNotifications,
    byType: notificationsByType,
    byPriority: notificationsByPriority,
    recent: recentNotifications,
  };
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        stats,
        "Notification statistics retrieved successfully"
      )
    );
});

// Admin: Bulk delete notifications
const bulkDeleteNotifications = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    throw new ApiError(403, "Admin access required");
  }
  const { notificationIds } = req.body;
  if (!notificationIds || !Array.isArray(notificationIds)) {
    throw new ApiError(400, "Notification IDs array is required");
  }
  const result = await Notification.deleteMany({
    _id: { $in: notificationIds },
  });
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { deletedCount: result.deletedCount },
        "Notifications deleted successfully"
      )
    );
});

// Admin: Deactivate expired notifications
const deactivateExpiredNotifications = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    throw new ApiError(403, "Admin access required");
  }
  const result = await Notification.updateMany(
    {
      expiresAt: { $lt: new Date() },
      isActive: true,
    },
    {
      isActive: false,
    }
  );
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { updatedCount: result.modifiedCount },
        "Expired notifications deactivated"
      )
    );
});

export {
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
};
