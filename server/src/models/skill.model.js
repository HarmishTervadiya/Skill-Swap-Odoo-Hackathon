import mongoose from "mongoose";

const skillSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
      },
      description: {
        type: String
      },
      isGlobal: {
        type: Boolean,
        default: true  // true for admin-created, false for user-created
      },
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true  
      },
}, {timestamps: true});

skillSchema.index({ name: 'text', description: 'text' });
skillSchema.index({ category: 1 });
skillSchema.index({ isApproved: 1 });

const Skill = mongoose.model("Skill", skillSchema);

export default Skill;