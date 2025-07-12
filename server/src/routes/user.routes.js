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
    getAllUsers,
    toggleUserBan,
    changeUserRole,
    deleteUser
} from '../controllers/user.controller.js';
import { upload } from "../middlewares/multer.middleware.js";
import { authenticateUser, authenticateAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.post('/', 
    upload.single('pic'),
    createUser);

router.get('/search', searchUsersBySkill);

// User profile routes 
router.get('/profile/:userId', getUserProfile);  
router.patch('/profile/:userId', authenticateUser, updateUserProfile);
router.patch('/profile/:userId/picture', 
    authenticateUser,
    upload.single('pic'),
    updateProfilePicture);

// Skill management routes
router.patch('/:userId/skills/offered', authenticateUser, updateOfferedSkills);
router.patch('/:userId/skills/wanted', authenticateUser, updateWantedSkills);
router.patch('/:userId/skills', authenticateUser, updateAllSkills);


// Admin routes (admin auth required)
router.get('/admin/all', authenticateAdmin, getAllUsers);
router.patch('/admin/:userId/ban', authenticateAdmin, toggleUserBan);
router.patch('/admin/:userId/role', authenticateAdmin, changeUserRole);
router.delete('/admin/:userId', authenticateAdmin, deleteUser);

export default router; 