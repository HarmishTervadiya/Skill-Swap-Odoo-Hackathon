import User from "../models/user.model.js";
import Skill from "../models/skill.model.js";
import SwapRequest from "../models/swapRequest.model.js";
import Feedback from "../models/feedback.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

const createUser = asyncHandler(async (req, res) => {
  // Check if req.body exists
  if (!req.body) {
    throw new ApiError(400, "Request body is required");
  }

  const { clerkId, name, email, profilePic, location, availability, isPublic } =
    req.body;

  // Validate required fields
  if (!clerkId || !name || !email || !profilePic) {
    throw new ApiError(
      400,
      "Clerk ID, name, email and profilePic are required"
    );
  }

  // Check if user already exists by clerkId or email
  const existingUser = await User.findOne({
    $or: [{ clerkId }, { email }],
  });
  if (existingUser) {
    throw new ApiError(409, "User with this Clerk ID or email already exists");
  }

  // Create the user
  const user = await User.create({
    clerkId,
    name,
    email,
    location: location || "",
    availability: availability || "Weekends",
    isPublic: isPublic !== undefined ? isPublic : true,
    skillsOffered: [],
    skillsWanted: [],
    rating: {
      average: 0,
      count: 0,
    },
    profilePicture: { publicId: "", uri: profilePic },
    isBanned: false,
  });

  const createdUser = await User.findById(user._id)
    .populate("skillsOffered", "name description")
    .populate("skillsWanted", "name description")
    .select("-__v");

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User created successfully"));
});

const getUserProfile = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId)
    .populate("skillsOffered", "name description")
    .populate("skillsWanted", "name description")
    .select("-__v");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Check if profile is private and user is not the owner
  if (!user.isPublic && (!req.user || req.user._id.toString() !== userId)) {
    throw new ApiError(403, "This profile is private");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User profile retrieved successfully"));
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { name, email, location, availability, isPublic } = req.body;

  if (
    !req.user ||
    (req.user._id.toString() !== userId && req.user.role !== "admin")
  ) {
    throw new ApiError(403, "You can only update your own profile");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (email && email !== user.email) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(409, "Email already in use");
    }
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        name: name || user.name,
        email: email || user.email,
        location: location !== undefined ? location : user.location,
        availability: availability || user.availability,
        isPublic: isPublic !== undefined ? isPublic : user.isPublic,
      },
    },
    { new: true }
  )
    .populate("skillsOffered", "name description")
    .populate("skillsWanted", "name description");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Profile updated successfully"));
});

const updateProfilePicture = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (
    !req.user ||
    (req.user._id.toString() !== userId && req.user.role !== "admin")
  ) {
    throw new ApiError(403, "You can only update your own profile picture");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const profilePicLocalPath = req.file?.path;

  if (!profilePicLocalPath) {
    throw new ApiError(400, "profilePic file is missing");
  }

  // Delete old profile picture from Cloudinary if it exists
  if (user.profilePicture && user.profilePicture.publicId) {
    await deleteFromCloudinary(user.profilePicture.publicId);
  }

  const profilePic = await uploadToCloudinary(profilePicLocalPath);

  if (!profilePic.url) {
    throw new ApiError(400, "Error while uploading profile picture");
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { profilePicture: { publicId: profilePic.public_id, uri: profilePic.url } },
    { new: true }
  )
    .populate("skillsOffered", "name description")
    .populate("skillsWanted", "name description");

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedUser, "Profile picture updated successfully")
    );
});

const updateOfferedSkills = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { skillIds } = req.body;

  if (
    !req.user ||
    (req.user._id.toString() !== userId && req.user.role !== "admin")
  ) {
    throw new ApiError(403, "You can only update your own skills");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Validate skillIds array
  if (!Array.isArray(skillIds)) {
    throw new ApiError(400, "skillIds must be an array");
  }

  // Validate that all skill IDs exist
  if (skillIds.length > 0) {
    const skills = await Skill.find({ _id: { $in: skillIds } });
    if (skills.length !== skillIds.length) {
      throw new ApiError(400, "One or more skill IDs are invalid");
    }
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { skillsOffered: skillIds },
    { new: true }
  )
    .populate("skillsOffered", "name description")
    .populate("skillsWanted", "name description");

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedUser, "Offered skills updated successfully")
    );
});

const updateWantedSkills = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { skillIds } = req.body;

  if (
    !req.user ||
    (req.user._id.toString() !== userId && req.user.role !== "admin")
  ) {
    throw new ApiError(403, "You can only update your own skills");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Validate skillIds array
  if (!Array.isArray(skillIds)) {
    throw new ApiError(400, "skillIds must be an array");
  }

  // Validate that all skill IDs exist
  if (skillIds.length > 0) {
    const skills = await Skill.find({ _id: { $in: skillIds } });
    if (skills.length !== skillIds.length) {
      throw new ApiError(400, "One or more skill IDs are invalid");
    }
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { skillsWanted: skillIds },
    { new: true }
  )
    .populate("skillsOffered", "name description")
    .populate("skillsWanted", "name description");

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedUser, "Wanted skills updated successfully")
    );
});

const updateAllSkills = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { offeredSkillIds, wantedSkillIds } = req.body;

  if (
    !req.user ||
    (req.user._id.toString() !== userId && req.user.role !== "admin")
  ) {
    throw new ApiError(403, "You can only update your own skills");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Validate arrays
  if (offeredSkillIds && !Array.isArray(offeredSkillIds)) {
    throw new ApiError(400, "offeredSkillIds must be an array");
  }

  if (wantedSkillIds && !Array.isArray(wantedSkillIds)) {
    throw new ApiError(400, "wantedSkillIds must be an array");
  }

  // Validate that all skill IDs exist
  const allSkillIds = [...(offeredSkillIds || []), ...(wantedSkillIds || [])];
  if (allSkillIds.length > 0) {
    const skills = await Skill.find({ _id: { $in: allSkillIds } });
    if (skills.length !== allSkillIds.length) {
      throw new ApiError(400, "One or more skill IDs are invalid");
    }
  }

  const updateData = {};
  if (offeredSkillIds !== undefined) {
    updateData.skillsOffered = offeredSkillIds;
  }
  if (wantedSkillIds !== undefined) {
    updateData.skillsWanted = wantedSkillIds;
  }

  const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
  })
    .populate("skillsOffered", "name description")
    .populate("skillsWanted", "name description");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Skills updated successfully"));
});

const searchUsersBySkill = asyncHandler(async (req, res) => {
  const { skillName, skillType = "offered" } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  if (!skillName) {
    throw new ApiError(400, "Skill name is required");
  }

  const skills = await Skill.find({
    name: { $regex: skillName, $options: "i" },
  });

  if (skills.length === 0) {
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          users: [],
          totalPages: 0,
          currentPage: page,
          totalUsers: 0,
          matchedSkills: [],
        },
        "No users found with this skill"
      )
    );
  }

  const skillIds = skills.map((skill) => skill._id);

  const query = {
    isPublic: true,
    isBanned: false,
  };

  if (skillType === "offered") {
    query.skillsOffered = { $in: skillIds };
  } else if (skillType === "wanted") {
    query.skillsWanted = { $in: skillIds };
  } else {
    query.$or = [
      { skillsOffered: { $in: skillIds } },
      { skillsWanted: { $in: skillIds } },
    ];
  }

  const users = await User.find(query)
    .populate("skillsOffered", "name description")
    .populate("skillsWanted", "name description")
    .select("-__v")
    .skip(skip)
    .limit(limit)
    .sort({ "rating.average": -1, createdAt: -1 });

  const totalUsers = await User.countDocuments(query);
  const totalPages = Math.ceil(totalUsers / limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        users,
        totalPages,
        currentPage: page,
        totalUsers,
        matchedSkills: skills.map((skill) => ({
          id: skill._id,
          name: skill.name,
        })),
        searchQuery: skillName,
      },
      "Users found successfully"
    )
  );
});

const getUserSwapRequests = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { status, type = "all" } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  if (
    !req.user ||
    (req.user._id.toString() !== userId && req.user.role !== "admin")
  ) {
    throw new ApiError(403, "You can only view your own swap requests");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Build query based on type
  let query = {};
  if (type === "sent") {
    query.requester = userId;
  } else if (type === "received") {
    query.receiver = userId;
  } else {
    query.$or = [{ requester: userId }, { receiver: userId }];
  }

  if (status) {
    query.status = status;
  }

  const swapRequests = await SwapRequest.find(query)
    .populate("requester", "name email profilePicture")
    .populate("receiver", "name email profilePicture")
    .populate("skillOffered", "name description")
    .populate("skillRequested", "name description")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalRequests = await SwapRequest.countDocuments(query);
  const totalPages = Math.ceil(totalRequests / limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        swapRequests,
        totalPages,
        currentPage: page,
        totalRequests,
      },
      "Swap requests retrieved successfully"
    )
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
    .populate("swapRequest", "skillOffered skillRequested")
    .populate("swapRequest.skillOffered", "name")
    .populate("swapRequest.skillRequested", "name")
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

const getAllUsers = asyncHandler(async (req, res) => {
  // if (!req.user || req.user.role !== 'admin') {
  //     throw new ApiError(403, "Admin access required");
  // }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const { search, role, isBanned } = req.query;

  let query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  if (role) {
    query.role = role;
  }

  if (isBanned !== undefined) {
    query.isBanned = isBanned === "true";
  }

  const users = await User.find(query)
    .populate("skillsOffered", "name")
    .populate("skillsWanted", "name")
    .select("-__v")
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const totalUsers = await User.countDocuments(query);
  const totalPages = Math.ceil(totalUsers / limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        users,
        totalPages,
        currentPage: page,
        totalUsers,
      },
      "Users retrieved successfully"
    )
  );
});

const toggleUserBan = asyncHandler(async (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    throw new ApiError(403, "Admin access required");
  }

  const { userId } = req.params;
  const { isBanned } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.role === "admin") {
    throw new ApiError(400, "Cannot ban admin users");
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { isBanned },
    { new: true }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedUser,
        `User ${isBanned ? "banned" : "unbanned"} successfully`
      )
    );
});

const changeUserRole = asyncHandler(async (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    throw new ApiError(403, "Admin access required");
  }

  const { userId } = req.params;
  const { role } = req.body;

  if (!["user", "admin"].includes(role)) {
    throw new ApiError(400, "Invalid role. Must be 'user' or 'admin'");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { role },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "User role updated successfully"));
});

const deleteUser = asyncHandler(async (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    throw new ApiError(403, "Admin access required");
  }

  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const activeSwapRequests = await SwapRequest.find({
    $or: [
      { requester: userId, status: { $in: ["Pending", "Accepted"] } },
      { receiver: userId, status: { $in: ["Pending", "Accepted"] } },
    ],
  });

  if (activeSwapRequests.length > 0) {
    throw new ApiError(400, "Cannot delete user with active swap requests");
  }

  await Feedback.deleteMany({
    $or: [{ reviewer: userId }, { reviewee: userId }],
  });

  await SwapRequest.deleteMany({
    $or: [{ requester: userId }, { receiver: userId }],
  });

  await User.findByIdAndDelete(userId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "User deleted successfully"));
});

export {
  createUser,
  getUserProfile,
  updateUserProfile,
  updateProfilePicture,
  updateOfferedSkills,
  updateWantedSkills,
  updateAllSkills,
  searchUsersBySkill,
  getUserSwapRequests,
  getUserFeedback,
  getAllUsers,
  toggleUserBan,
  changeUserRole,
  deleteUser,
};
