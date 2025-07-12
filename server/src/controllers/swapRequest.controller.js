import SwapRequest from '../models/swapRequest.model.js';
import User from '../models/user.model.js';
import Skill from '../models/skill.model.js';
import Notification from '../models/notification.model.js';
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createSwapRequest = asyncHandler(async (req, res) => {
    if (!req.body) {
        throw new ApiError(400, "Request body is required");
    }
    
    const { receiverId, skillOfferedId, skillRequestedId, message } = req.body;
    const requesterId = req.user?._id; 
    
    if (!receiverId || !skillOfferedId || !skillRequestedId) {
        throw new ApiError(400, "Receiver, skill offered, and skill requested are required");
    }
    
    if (requesterId.toString() === receiverId) {
        throw new ApiError(400, "Cannot create swap request with yourself");
    }
    
    const receiver = await User.findById(receiverId);
    if (!receiver) {
        throw new ApiError(404, "Receiver not found");
    }
    if (receiver.isBanned) {
        throw new ApiError(400, "Cannot create swap request with banned user");
    }
    if (!receiver.isPublic) {
        throw new ApiError(400, "Cannot create swap request with private profile");
    }
    
    const skillOffered = await Skill.findById(skillOfferedId);
    const skillRequested = await Skill.findById(skillRequestedId);
    
    if (!skillOffered || !skillRequested) {
        throw new ApiError(404, "One or both skills not found");
    }
    
    const requester = await User.findById(requesterId);
    if (!requester.skillsOffered.includes(skillOfferedId)) {
        throw new ApiError(400, "You don't have this skill in your offered skills");
    }
    
    if (!receiver.skillsOffered.includes(skillRequestedId)) {
        throw new ApiError(400, "Receiver doesn't have this skill in their offered skills");
    }
    
    if (!receiver.skillsWanted.includes(skillOfferedId)) {
        throw new ApiError(400, "Receiver doesn't want this skill");
    }
    
    if (!requester.skillsWanted.includes(skillRequestedId)) {
        throw new ApiError(400, "You don't want this skill");
    }
    
    const existingRequest = await SwapRequest.findOne({
        $or: [
            {
                requester: requesterId,
                receiver: receiverId,
                skillOffered: skillOfferedId,
                skillRequested: skillRequestedId,
                status: "Pending"
            },
            {
                requester: receiverId,
                receiver: requesterId,
                skillOffered: skillRequestedId,
                skillRequested: skillOfferedId,
                status: "Pending"
            }
        ]
    });
    
    if (existingRequest) {
        throw new ApiError(400, "A swap request already exists between you for these skills");
    }
    
    const swapRequest = await SwapRequest.create({
        requester: requesterId,
        receiver: receiverId,
        skillOffered: skillOfferedId,
        skillRequested: skillRequestedId,
        message: message || ""
    });
    
    const populatedSwapRequest = await SwapRequest.findById(swapRequest._id)
        .populate('requester', 'name email profilePicture')
        .populate('receiver', 'name email profilePicture')
        .populate('skillOffered', 'name description')
        .populate('skillRequested', 'name description');
    
    await Notification.create({
        title: "New Swap Request",
        message: `${requester.name} has made a swap request to you: ${skillOffered.name} for ${skillRequested.name}`,
        type: "swap_request",
        createdBy: requesterId,
        recipient: receiverId
    });
    
    return res.status(201).json(
        new ApiResponse(201, populatedSwapRequest, "Swap request created successfully")
    );
});

const acceptSwapRequest = asyncHandler(async (req, res) => {
    const { requestId } = req.params;
    const userId = req.user._id;

    const swapRequest = await SwapRequest.findById(requestId);
    if (!swapRequest) {
        throw new ApiError(404, "Swap request not found");
    }

    if (swapRequest.requester.toString() === userId.toString()) {
        throw new ApiError(403, "You cannot accept your own swap request");
    }

    if (swapRequest.status !== "Pending") {
        throw new ApiError(400, "This swap request is no longer pending");
    }

    swapRequest.status = "Completed";
    swapRequest.acceptedAt = new Date();
    swapRequest.acceptedBy = userId;
    await swapRequest.save();

    const populatedSwapRequest = await SwapRequest.findById(requestId)
        .populate('requester', 'name email profilePicture')
        .populate('receiver', 'name email profilePicture')
        .populate('skillOffered', 'name description')
        .populate('skillRequested', 'name description');

        await Notification.create({
            title: "Swap Request Accepted",
            message: `${req.user.name} has accepted your swap request: ${populatedSwapRequest.skillOffered.name} for ${populatedSwapRequest.skillRequested.name}`,
            type: "swap_accepted",
            createdBy: userId,
            recipient: swapRequest.requester
        });

    return res.status(200).json(
        new ApiResponse(200, populatedSwapRequest, "Swap request accepted and completed successfully")
    );
});

const rejectSwapRequest = asyncHandler(async (req, res) => {
    const { requestId } = req.params;
    const receiverId = req.user._id;
    
    const swapRequest = await SwapRequest.findById(requestId);
    if (!swapRequest) {
        throw new ApiError(404, "Swap request not found");
    }
    
    // Check if the current user is the receiver
    if (swapRequest.receiver.toString() !== receiverId.toString()) {
        throw new ApiError(403, "You can only reject swap requests sent to you");
    }
    
    // Check if the request is still pending
    if (swapRequest.status !== "Pending") {
        throw new ApiError(400, "This swap request is no longer pending");
    }
    
    // Update the swap request status
    const updatedSwapRequest = await SwapRequest.findByIdAndUpdate(
        requestId,
        {
            status: "Rejected",
            rejectedAt: new Date()
        },
        { new: true }
    ).populate('requester', 'name email profilePicture')
     .populate('receiver', 'name email profilePicture')
     .populate('skillOffered', 'name description')
     .populate('skillRequested', 'name description');
    
    // Create notification for requester
    await Notification.create({
        title: "Swap Request Rejected",
        message: `${req.user.name} has rejected your swap request: ${updatedSwapRequest.skillOffered.name} for ${updatedSwapRequest.skillRequested.name}`,
        type: "swap_rejected",
        createdBy: receiverId,
        recipient: swapRequest.requester
    });
    
    return res.status(200).json(
        new ApiResponse(200, updatedSwapRequest, "Swap request rejected successfully")
    );
});

// Complete a swap request
const completeSwapRequest = asyncHandler(async (req, res) => {
    const { requestId } = req.params;
    const userId = req.user._id;
    
    const swapRequest = await SwapRequest.findById(requestId);
    if (!swapRequest) {
        throw new ApiError(404, "Swap request not found");
    }
    
    // Check if the current user is either requester or receiver
    if (swapRequest.requester.toString() !== userId.toString() && 
        swapRequest.receiver.toString() !== userId.toString()) {
        throw new ApiError(403, "You can only complete swap requests you're involved in");
    }
    
    // Check if the request is accepted
    if (swapRequest.status !== "Accepted") {
        throw new ApiError(400, "Only accepted swap requests can be completed");
    }
    
    // Update the swap request status
    const updatedSwapRequest = await SwapRequest.findByIdAndUpdate(
        requestId,
        {
            status: "Completed",
            completedAt: new Date()
        },
        { new: true }
    ).populate('requester', 'name email profilePicture')
     .populate('receiver', 'name email profilePicture')
     .populate('skillOffered', 'name description')
     .populate('skillRequested', 'name description');
    
    const otherUserId = swapRequest.requester.toString() === userId.toString() 
        ? swapRequest.receiver 
        : swapRequest.requester;
    
    await Notification.create({
        title: "Swap Completed",
        message: `Your swap for ${updatedSwapRequest.skillOffered.name} and ${updatedSwapRequest.skillRequested.name} has been completed`,
        type: "swap_completed",
        createdBy: userId,
        recipient: otherUserId
    });
    
    return res.status(200).json(
        new ApiResponse(200, updatedSwapRequest, "Swap request completed successfully")
    );
});

const cancelSwapRequest = asyncHandler(async (req, res) => {
    const { requestId } = req.params;
    const requesterId = req.user._id;
    
    const swapRequest = await SwapRequest.findById(requestId);
    if (!swapRequest) {
        throw new ApiError(404, "Swap request not found");
    }
    
    if (swapRequest.requester.toString() !== requesterId.toString()) {
        throw new ApiError(403, "You can only cancel swap requests you created");
    }
    
    if (swapRequest.status !== "Pending") {
        throw new ApiError(400, "Only pending swap requests can be cancelled");
    }
    
    const updatedSwapRequest = await SwapRequest.findByIdAndUpdate(
        requestId,
        {
            status: "Cancelled"
        },
        { new: true }
    ).populate('requester', 'name email profilePicture')
     .populate('receiver', 'name email profilePicture')
     .populate('skillOffered', 'name description')
     .populate('skillRequested', 'name description');
    
    await Notification.create({
        title: "Swap Request Cancelled",
        message: `${req.user.name} has cancelled the swap request: ${updatedSwapRequest.skillOffered.name} for ${updatedSwapRequest.skillRequested.name}`,
        type: "swap_cancelled",
        createdBy: requesterId,
        recipient: swapRequest.receiver
    });
    
    return res.status(200).json(
        new ApiResponse(200, updatedSwapRequest, "Swap request cancelled successfully")
    );
});

const deleteSwapRequest = asyncHandler(async (req, res) => {
    const { requestId } = req.params;
    const userId = req.user._id;

    const swapRequest = await SwapRequest.findById(requestId);
    if (!swapRequest) {
        throw new ApiError(404, "Swap request not found");
    }

    if (swapRequest.requester.toString() !== userId.toString()) {
        throw new ApiError(403, "You can only delete your own swap requests");
    }
    if (swapRequest.status !== "Pending") {
        throw new ApiError(400, "You can only delete pending swap requests");
    }

    await SwapRequest.findByIdAndDelete(requestId);
    return res.status(200).json(
        new ApiResponse(200, {}, "Swap request deleted successfully")
    );
});

const getSwapRequest = asyncHandler(async (req, res) => {
    const { requestId } = req.params;
    const userId = req.user._id;
    
    const swapRequest = await SwapRequest.findById(requestId)
        .populate('requester', 'name email profilePicture')
        .populate('receiver', 'name email profilePicture')
        .populate('skillOffered', 'name description')
        .populate('skillRequested', 'name description');
    
    if (!swapRequest) {
        throw new ApiError(404, "Swap request not found");
    }
    
    if (swapRequest.requester._id.toString() !== userId.toString() && 
        swapRequest.receiver._id.toString() !== userId.toString() &&
        req.user.role !== 'admin') {
        throw new ApiError(403, "You can only view swap requests you're involved in");
    }
    
    return res.status(200).json(
        new ApiResponse(200, swapRequest, "Swap request retrieved successfully")
    );
});

const getAllSwapRequests = asyncHandler(async (req, res) => {
    if (req.user.role !== 'admin') {
        throw new ApiError(403, "Admin access required");
    }
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { status, search } = req.query;
    
    let query = {};
    
    if (status) {
        query.status = status;
    }
    
    if (search) {
        query.$or = [
            { message: { $regex: search, $options: 'i' } }
        ];
    }
    
    const swapRequests = await SwapRequest.find(query)
        .populate('requester', 'name email')
        .populate('receiver', 'name email')
        .populate('skillOffered', 'name')
        .populate('skillRequested', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    
    const totalRequests = await SwapRequest.countDocuments(query);
    const totalPages = Math.ceil(totalRequests / limit);
    
    return res.status(200).json(
        new ApiResponse(200, {
            swapRequests,
            totalPages,
            currentPage: page,
            totalRequests
        }, "Swap requests retrieved successfully")
    );
});

const getSwapRequestStats = asyncHandler(async (req, res) => {
    if (req.user.role !== 'admin') {
        throw new ApiError(403, "Admin access required");
    }
    
    const totalRequests = await SwapRequest.countDocuments();
    const pendingRequests = await SwapRequest.countDocuments({ status: "Pending" });
    const acceptedRequests = await SwapRequest.countDocuments({ status: "Accepted" });
    const completedRequests = await SwapRequest.countDocuments({ status: "Completed" });
    const rejectedRequests = await SwapRequest.countDocuments({ status: "Rejected" });
    const cancelledRequests = await SwapRequest.countDocuments({ status: "Cancelled" });
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentRequests = await SwapRequest.countDocuments({
        createdAt: { $gte: thirtyDaysAgo }
    });
    
    const stats = {
        total: totalRequests,
        pending: pendingRequests,
        accepted: acceptedRequests,
        completed: completedRequests,
        rejected: rejectedRequests,
        cancelled: cancelledRequests,
        recentActivity: recentRequests
    };
    
    return res.status(200).json(
        new ApiResponse(200, stats, "Swap request statistics retrieved successfully")
    );
});

const getPublicSwapRequests = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { skill, search } = req.query;

    const publicUsers = await User.find({ isPublic: true, isBanned: false }).select('_id');
    const publicUserIds = publicUsers.map(u => u._id);

    let query = {
        requester: { $in: publicUserIds },
        status: 'Pending',
    };

    if (skill) {
        query.$or = [
            { skillOffered: skill },
            { skillRequested: skill }
        ];
    }
    if (search) {
        query.message = { $regex: search, $options: 'i' };
    }

    const swapRequests = await SwapRequest.find(query)
        .populate('requester', 'name email profilePicture isPublic')
        .populate('skillOffered', 'name description')
        .populate('skillRequested', 'name description')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const totalRequests = await SwapRequest.countDocuments(query);
    const totalPages = Math.ceil(totalRequests / limit);

    return res.status(200).json(
        new ApiResponse(200, {
            swapRequests,
            totalPages,
            currentPage: page,
            totalRequests
        }, "Public swap requests retrieved successfully")
    );
});

export {
    createSwapRequest,
    acceptSwapRequest,
    rejectSwapRequest,
    completeSwapRequest,
    cancelSwapRequest,
    deleteSwapRequest,
    getSwapRequest,
    getAllSwapRequests,
    getSwapRequestStats,
    getPublicSwapRequests
}; 