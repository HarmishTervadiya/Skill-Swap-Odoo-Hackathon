import Feedback from "../models/feedback.model.js";
import SwapRequest from "../models/swapRequest.model.js";
import User from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createFeedback = asyncHandler(async (req, res) => {
  if (!req.body) {
    throw new ApiError(400, "Request body is required");
  }

  const { revieweeId, rating, comment } = req.body;
  const reviewerId = req.user?._id;

  if (!revieweeId || !rating) {
    throw new ApiError(400, "Reviewee ID and rating are required");
  }

  if (rating < 1 || rating > 5) {
    throw new ApiError(400, "Rating must be between 1 and 5");
  }

  if (reviewerId.toString() === revieweeId) {
    throw new ApiError(400, "You cannot give feedback to yourself");
  }

  const reviewee = await User.findById(revieweeId);
  if (!reviewee) {
    throw new ApiError(404, "User to review not found");
  }

  const completedSwap = await SwapRequest.findOne({
    $or: [
      {
        requester: reviewerId,
        receiver: revieweeId,
        status: "Completed",
      },
      {
        requester: revieweeId,
        receiver: reviewerId,
        status: "Completed",
      },
    ],
  });

  if (!completedSwap) {
    throw new ApiError(
      403,
      "You can only give feedback to users you have completed swaps with"
    );
  }

  const existingFeedback = await Feedback.findOne({
    reviewer: reviewerId,
    reviewee: revieweeId,
  });

  if (existingFeedback) {
    throw new ApiError(400, "You have already given feedback to this user");
  }

  const feedback = await Feedback.create({
    reviewer: reviewerId,
    reviewee: revieweeId,
    rating,
    comment: comment || "",
  });

  const populatedFeedback = await Feedback.findById(feedback._id)
    .populate("reviewer", "name profilePicture")
    .populate("reviewee", "name profilePicture");

  await updateUserRating(revieweeId);

  return res
    .status(201)
    .json(
      new ApiResponse(201, populatedFeedback, "Feedback created successfully")
    );
});

const getUserFeedback = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const feedback = await Feedback.find({ reviewee: userId })
    .populate("reviewer", "name profilePicture")
    .populate("reviewee", "name profilePicture")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalFeedback = await Feedback.countDocuments({ reviewee: userId });
  const totalPages = Math.ceil(totalFeedback / limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        feedback,
        totalPages,
        currentPage: page,
        totalFeedback,
      },
      "User feedback retrieved successfully"
    )
  );
});

const updateFeedback = asyncHandler(async (req, res) => {
  const { feedbackId } = req.params;
  const { rating, comment } = req.body;
  const reviewerId = req.user._id;

  if (rating && (rating < 1 || rating > 5)) {
    throw new ApiError(400, "Rating must be between 1 and 5");
  }

  const feedback = await Feedback.findById(feedbackId);
  if (!feedback) {
    throw new ApiError(404, "Feedback not found");
  }

  if (feedback.reviewer.toString() !== reviewerId.toString()) {
    throw new ApiError(403, "You can only update your own feedback");
  }

  const updatedFeedback = await Feedback.findByIdAndUpdate(
    feedbackId,
    {
      $set: {
        rating: rating || feedback.rating,
        comment: comment !== undefined ? comment : feedback.comment,
      },
    },
    { new: true }
  )
    .populate("reviewer", "name profilePicture")
    .populate("reviewee", "name profilePicture");

  await updateUserRating(feedback.reviewee);

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedFeedback, "Feedback updated successfully")
    );
});

const deleteFeedback = asyncHandler(async (req, res) => {
  const { feedbackId } = req.params;
  const userId = req.user._id;

  const feedback = await Feedback.findById(feedbackId);
  if (!feedback) {
    throw new ApiError(404, "Feedback not found");
  }

  if (
    feedback.reviewer.toString() !== userId.toString() &&
    req.user.role !== "admin"
  ) {
    throw new ApiError(403, "You can only delete your own feedback");
  }

  const revieweeId = feedback.reviewee;

  await Feedback.findByIdAndDelete(feedbackId);

  await updateUserRating(revieweeId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Feedback deleted successfully"));
});

const getAllFeedback = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    throw new ApiError(403, "Admin access required");
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const { rating, search } = req.query;

  let query = {};

  if (rating) {
    query.rating = parseInt(rating);
  }

  if (search) {
    query.$or = [{ comment: { $regex: search, $options: "i" } }];
  }

  const feedback = await Feedback.find(query)
    .populate("reviewer", "name email")
    .populate("reviewee", "name email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalFeedback = await Feedback.countDocuments(query);
  const totalPages = Math.ceil(totalFeedback / limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        feedback,
        totalPages,
        currentPage: page,
        totalFeedback,
      },
      "Feedback retrieved successfully"
    )
  );
});

const getFeedbackStats = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    throw new ApiError(403, "Admin access required");
  }

  const totalFeedback = await Feedback.countDocuments();
  const averageRating = await Feedback.aggregate([
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
      },
    },
  ]);

  const ratingDistribution = await Feedback.aggregate([
    {
      $group: {
        _id: "$rating",
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentFeedback = await Feedback.countDocuments({
    createdAt: { $gte: thirtyDaysAgo },
  });

  const stats = {
    total: totalFeedback,
    averageRating: averageRating[0]?.averageRating || 0,
    ratingDistribution,
    recentFeedback,
  };

  return res
    .status(200)
    .json(
      new ApiResponse(200, stats, "Feedback statistics retrieved successfully")
    );
});

const updateUserRating = async (userId) => {
  const feedbackStats = await Feedback.aggregate([
    {
      $match: { reviewee: userId },
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  if (feedbackStats.length > 0) {
    const { averageRating, count } = feedbackStats[0];
    await User.findByIdAndUpdate(userId, {
      "rating.average": Math.round(averageRating * 10) / 10,
      "rating.count": count,
    });
  } else {
    await User.findByIdAndUpdate(userId, {
      "rating.average": 0,
      "rating.count": 0,
    });
  }
};

const getUserFeedbackSummary = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const feedbackStats = await Feedback.aggregate([
    {
      $match: { reviewee: userId },
    },
    {
      $group: {
        _id: null,
        totalFeedback: { $sum: 1 },
        averageRating: { $avg: "$rating" },
        ratingDistribution: {
          $push: "$rating",
        },
      },
    },
  ]);

  let summary = {
    totalFeedback: 0,
    averageRating: 0,
    ratingDistribution: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    },
  };

  if (feedbackStats.length > 0) {
    const stats = feedbackStats[0];
    summary.totalFeedback = stats.totalFeedback;
    summary.averageRating = Math.round(stats.averageRating * 10) / 10;

    stats.ratingDistribution.forEach((rating) => {
      summary.ratingDistribution[rating]++;
    });
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        summary,
        "User feedback summary retrieved successfully"
      )
    );
});

export {
  createFeedback,
  getUserFeedback,
  updateFeedback,
  deleteFeedback,
  getAllFeedback,
  getFeedbackStats,
  getUserFeedbackSummary,
};
