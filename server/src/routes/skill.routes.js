import { Router } from "express";
import {
    createSkill,
    getAllSkills,
    getSkill,
    updateSkill,
    deleteSkill,
    searchSkills,
    getPendingSkills,
    approveSkill,
    rejectSkill,
} from '../controllers/skill.controller.js';
import { authenticateUser, authenticateAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.post('/', authenticateUser, createSkill);
router.get('/', getAllSkills); 
router.get('/search', searchSkills);  
router.get('/:skillId', getSkill);  
router.patch('/:skillId', authenticateUser, updateSkill);  
router.delete('/:skillId', authenticateUser, deleteSkill);  

// Admin routes (admin auth required)
router.get('/admin/pending', authenticateAdmin, getPendingSkills);
router.patch('/admin/:skillId/approve', authenticateAdmin, approveSkill);
router.patch('/admin/:skillId/reject', authenticateAdmin, rejectSkill);

export default router;