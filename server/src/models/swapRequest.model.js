import mongoose from "mongoose";

const swapRequestSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    skillOffered: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skills",
      required: true,
    },
    skillRequested: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skills",
      required: true,
    },
    message: {
      type: String,
      maxlength: 500,
    },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected", "Completed", "Cancelled"],
      default: "Pending",
    },
    acceptedAt: Date,
    completedAt: Date,
    rejectedAt: Date,
  },
  { timestamps: true }
);

swapRequestSchema.index({ requester: 1, status: 1 });
swapRequestSchema.index({ receiver: 1, status: 1 });
swapRequestSchema.index({ status: 1, createdAt: -1 });

const SwapRequest = new mongoose.model("SwapRequest", swapRequestSchema);

export default SwapRequest;
