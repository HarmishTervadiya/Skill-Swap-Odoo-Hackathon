import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    swapRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SwapRequest",
      required: true,
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reviewee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      maxlength: 500,
    },
  },
  { timestamps: true }
);

feedbackSchema.index({ reviewee: 1 });
feedbackSchema.index({ swapRequest: 1 }, { unique: true });

const Feedback = new mongoose.model("Feedback", feedbackSchema);

export default Feedback;
