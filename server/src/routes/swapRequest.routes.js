import { Router } from "express";
import {
    createSwapRequest,
    acceptSwapRequest,
    rejectSwapRequest,
    completeSwapRequest,
    cancelSwapRequest,
    getSwapRequest,
    getAllSwapRequests,
    getSwapRequestStats,
    getPublicSwapRequests,
    deleteSwapRequest
} from '../controllers/swapRequest.controller.js';
import { authenticateUser, authenticateAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// Public route to list all public swap requests
router.get('/public', getPublicSwapRequests);

// Swap request management routes (authenticated - only involved users can access)
router.post('/', authenticateUser, createSwapRequest);
router.get('/:requestId', authenticateUser, getSwapRequest);  // Only requester/receiver can view

// Swap request action routes (authenticated - only involved users can perform actions)
router.patch('/:requestId/accept', authenticateUser, acceptSwapRequest);
router.patch('/:requestId/reject', authenticateUser, rejectSwapRequest);
router.patch('/:requestId/complete', authenticateUser, completeSwapRequest);
router.patch('/:requestId/cancel', authenticateUser, cancelSwapRequest);
router.delete('/:requestId', authenticateUser, deleteSwapRequest); // Only creator can delete if pending

// Admin routes (admin auth required)
router.get('/admin/all', authenticateAdmin, getAllSwapRequests);
router.get('/admin/stats', authenticateAdmin, getSwapRequestStats);

export default router; 