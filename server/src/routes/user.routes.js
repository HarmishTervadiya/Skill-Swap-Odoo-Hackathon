import { Router } from "express";
import {
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
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  authenticateUser,
  authenticateAdmin,
} from "../middlewares/auth.middleware.js";

const router = Router();

// User creation route (no auth required)
router.post("/", upload.single("pic"), createUser);

router.get("/", getAllUsers);

// Search and browse routes (public - no auth required)
router.get("/search", searchUsersBySkill);

// User profile routes (public read, authenticated update)
router.get("/profile/:userId", getUserProfile); // Public - anyone can view public profiles
router.patch("/profile/:userId", authenticateUser, updateUserProfile);
router.patch(
  "/profile/:userId/picture",
  authenticateUser,
  upload.single("pic"),
  updateProfilePicture
);

// Skill management routes (authenticated - only owner can update)
router.patch("/:userId/skills/offered", authenticateUser, updateOfferedSkills);
router.patch("/:userId/skills/wanted", authenticateUser, updateWantedSkills);
router.patch("/:userId/skills", authenticateUser, updateAllSkills);

// User data routes (authenticated - only owner can view)
router.get("/:userId/swap-requests", authenticateUser, getUserSwapRequests);
router.get("/:userId/feedback", getUserFeedback); // Public - anyone can view feedback

// Admin routes (admin auth required)
router.get("/admin/all", authenticateAdmin, getAllUsers);
router.patch("/admin/:userId/ban", authenticateAdmin, toggleUserBan);
router.patch("/admin/:userId/role", authenticateAdmin, changeUserRole);
router.delete("/admin/:userId", authenticateAdmin, deleteUser);

export default router;
