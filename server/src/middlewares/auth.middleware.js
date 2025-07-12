import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiErrors.js";

export const authenticateUser = async (req, res, next) => {
  try {
    const clerkId = req.headers["x-clerk-id"] || req.body?.clerkId;

    if (!clerkId) {
      throw new ApiError(401, "Clerk ID is required for authentication");
    }

    const user = await User.findOne({ clerkId });

    if (!user) {
      throw new ApiError(401, "User not found with this Clerk ID");
    }

    if (user.isBanned) {
      throw new ApiError(403, "Your account has been banned");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    const clerkId = req.headers["x-clerk-id"] || req.body?.clerkId;

    if (clerkId) {
      const user = await User.findOne({ clerkId });
      if (user && !user.isBanned) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    next();
  }
};

export const authenticateAdmin = async (req, res, next) => {
  try {
    const clerkId = req.headers["x-clerk-id"] || req.body?.clerkId;

    if (!clerkId) {
      throw new ApiError(401, "Clerk ID is required for admin authentication");
    }

    const user = await User.findOne({ clerkId });

    if (!user) {
      throw new ApiError(401, "User not found with this Clerk ID");
    }

    if (user.isBanned) {
      throw new ApiError(403, "Your account has been banned");
    }

    if (user.role !== "admin") {
      throw new ApiError(403, "Admin access required");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
