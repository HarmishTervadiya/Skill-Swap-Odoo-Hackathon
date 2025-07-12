import Skill from '../models/skill.model.js';
import User from '../models/user.model.js';
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createSkill = asyncHandler(async (req, res) => {
    if (!req.body) {
        throw new ApiError(400, "Request body is required");
    }
    
    const { name, description } = req.body;
    const createdBy = req.user?._id || "000000000000000000000000"; 
    
    if (!name) {
        throw new ApiError(400, "Skill name is required");
    }
    
    const existingSkill = await Skill.findOne({ 
        name: { $regex: new RegExp(`^${name}$`, 'i') } 
    });
    
    if (existingSkill) {
        throw new ApiError(400, "Skill with this name already exists");
    }
    
    const skill = await Skill.create({
        name,
        description: description || "",
        createdBy,
        isGlobal: req.user?.role === 'admin' || req.user?.role === '000000000000000000000000' 
    });
    
    const populatedSkill = await Skill.findById(skill._id)
        .populate('createdBy', 'name email');
    
    return res.status(201).json(
        new ApiResponse(201, populatedSkill, "Skill created successfully")
    );
});

const getAllSkills = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { search, isGlobal, createdBy } = req.query;
    
    let query = {};
    
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
        ];
    }
    
    if (isGlobal !== undefined) {
        query.isGlobal = isGlobal === 'true';
    }
    
    if (createdBy) {
        query.createdBy = createdBy;
    }
    
    const skills = await Skill.find(query)
        .populate('createdBy', 'name email')
        .sort({ name: 1 })
        .skip(skip)
        .limit(limit);
    
    const totalSkills = await Skill.countDocuments(query);
    const totalPages = Math.ceil(totalSkills / limit);
    
    return res.status(200).json(
        new ApiResponse(200, {
            skills,
            totalPages,
            currentPage: page,
            totalSkills
        }, "Skills retrieved successfully")
    );
});

const getSkill = asyncHandler(async (req, res) => {
    const { skillId } = req.params;
    
    const skill = await Skill.findById(skillId)
        .populate('createdBy', 'name email');
    
    if (!skill) {
        throw new ApiError(404, "Skill not found");
    }
    
    return res.status(200).json(
        new ApiResponse(200, skill, "Skill retrieved successfully")
    );
});

const updateSkill = asyncHandler(async (req, res) => {
    const { skillId } = req.params;
    const { name, description, isGlobal } = req.body;
    
    const skill = await Skill.findById(skillId);
    if (!skill) {
        throw new ApiError(404, "Skill not found");
    }
    
    if (!req.user || (skill.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin')) {
        throw new ApiError(403, "You can only update skills you created");
    }
    
    if (name && name !== skill.name) {
        const existingSkill = await Skill.findOne({ 
            name: { $regex: new RegExp(`^${name}$`, 'i') },
            _id: { $ne: skillId }
        });
        
        if (existingSkill) {
            throw new ApiError(400, "Skill with this name already exists");
        }
    }
    
    const updatedSkill = await Skill.findByIdAndUpdate(
        skillId,
        {
            $set: {
                name: name || skill.name,
                description: description !== undefined ? description : skill.description,
                isGlobal: isGlobal !== undefined ? isGlobal : skill.isGlobal
            }
        },
        { new: true }
    ).populate('createdBy', 'name email');
    
    return res.status(200).json(
        new ApiResponse(200, updatedSkill, "Skill updated successfully")
    );
});

const deleteSkill = asyncHandler(async (req, res) => {
    const { skillId } = req.params;
    
    const skill = await Skill.findById(skillId);
    if (!skill) {
        throw new ApiError(404, "Skill not found");
    }
    
    if (!req.user || (skill.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin')) {
        throw new ApiError(403, "You can only delete skills you created");
    }
    
    const usersWithSkill = await User.find({
        $or: [
            { skillsOffered: skillId },
            { skillsWanted: skillId }
        ]
    });
    
    if (usersWithSkill.length > 0) {
        throw new ApiError(400, "Cannot delete skill that is being used by users");
    }
    
    await Skill.findByIdAndDelete(skillId);
    
    return res.status(200).json(
        new ApiResponse(200, {}, "Skill deleted successfully")
    );
});

const searchSkills = asyncHandler(async (req, res) => {
    const { query } = req.query;
    const limit = parseInt(req.query.limit) || 10;
    
    if (!query) {
        throw new ApiError(400, "Search query is required");
    }
    
    const skills = await Skill.find({
        $or: [
            { name: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } }
        ]
    })
    .populate('createdBy', 'name email')
    .sort({ name: 1 })
    .limit(limit);
    
    return res.status(200).json(
        new ApiResponse(200, skills, "Skills found successfully")
    );
});

// Admin: Get skills pending approval (non-global skills)
const getPendingSkills = asyncHandler(async (req, res) => {
    if (!req.user || req.user.role !== 'admin') {
        throw new ApiError(403, "Admin access required");
    }
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const skills = await Skill.find({ isGlobal: false })
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    
    const totalSkills = await Skill.countDocuments({ isGlobal: false });
    const totalPages = Math.ceil(totalSkills / limit);
    
    return res.status(200).json(
        new ApiResponse(200, {
            skills,
            totalPages,
            currentPage: page,
            totalSkills
        }, "Pending skills retrieved successfully")
    );
});

// Admin: Approve a skill (make it global)
const approveSkill = asyncHandler(async (req, res) => {
    if (!req.user || req.user.role !== 'admin') {
        throw new ApiError(403, "Admin access required");
    }
    
    const { skillId } = req.params;
    
    const skill = await Skill.findById(skillId);
    if (!skill) {
        throw new ApiError(404, "Skill not found");
    }
    
    if (skill.isGlobal) {
        throw new ApiError(400, "Skill is already global");
    }
    
    const updatedSkill = await Skill.findByIdAndUpdate(
        skillId,
        { isGlobal: true },
        { new: true }
    ).populate('createdBy', 'name email');
    
    return res.status(200).json(
        new ApiResponse(200, updatedSkill, "Skill approved successfully")
    );
});

// Admin: Reject a skill (delete non-global skill)
const rejectSkill = asyncHandler(async (req, res) => {
    if (!req.user || req.user.role !== 'admin') {
        throw new ApiError(403, "Admin access required");
    }
    
    const { skillId } = req.params;
    
    const skill = await Skill.findById(skillId);
    if (!skill) {
        throw new ApiError(404, "Skill not found");
    }
    
    if (skill.isGlobal) {
        throw new ApiError(400, "Cannot reject a global skill");
    }
    
    // Check if skill is being used
    const usersWithSkill = await User.find({
        $or: [
            { skillsOffered: skillId },
            { skillsWanted: skillId }
        ]
    });
    
    if (usersWithSkill.length > 0) {
        throw new ApiError(400, "Cannot reject skill that is being used by users");
    }
    
    await Skill.findByIdAndDelete(skillId);
    
    return res.status(200).json(
        new ApiResponse(200, {}, "Skill rejected and deleted successfully")
    );
});


export {
    createSkill,
    getAllSkills,
    getSkill,
    updateSkill,
    deleteSkill,
    searchSkills,
    getPendingSkills,
    approveSkill,
    rejectSkill,
};