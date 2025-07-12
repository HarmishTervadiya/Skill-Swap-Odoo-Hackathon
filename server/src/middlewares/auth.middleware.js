import User from '../models/user.model.js';
import { ApiError } from '../utils/ApiErrors.js';

// Clerk authentication middleware
export const authenticateUser = async (req, res, next) => {
    try {
        // Get clerkId from request headers or body
        const clerkId = req.headers['x-clerk-id'] || req.body?.clerkId;
        
        if (!clerkId) {
            throw new ApiError(401, "Clerk ID is required for authentication");
        }
        
        // Find user by clerkId
        const user = await User.findOne({ clerkId });
        
        if (!user) {
            throw new ApiError(401, "User not found with this Clerk ID");
        }
        
        if (user.isBanned) {
            throw new ApiError(403, "Your account has been banned");
        }
        
        // Attach user to request object
        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};

// Optional authentication middleware (for routes that can work without auth)
export const optionalAuth = async (req, res, next) => {
    try {
        const clerkId = req.headers['x-clerk-id'] || req.body?.clerkId;
        
        if (clerkId) {
            const user = await User.findOne({ clerkId });
            if (user && !user.isBanned) {
                req.user = user;
            }
        }
        
        next();
    } catch (error) {
        // Continue without authentication if there's an error
        next();
    }
};

// Admin authentication middleware
export const authenticateAdmin = async (req, res, next) => {
    try {
        const clerkId = req.headers['x-clerk-id'] || req.body?.clerkId;
        
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
        
        if (user.role !== 'admin') {
            throw new ApiError(403, "Admin access required");
        }
        
        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
}