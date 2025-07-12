import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    location: {
      type: String,
    },
    profilePicture: {
      uri: {
        type: String,
        default: "https://via.placeholder.com/150",
      },
      publicId: {
        type: String,
      },
    },
    availability: {
      type: String,
      enum: ["Weekends", "Evenings"],
      default: "Weekends",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    skillsOffered: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Skill",
      },
    ],
    skillsWanted: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Skill",
      },
    ],
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.index({ email: 1 });
userSchema.index({ isPublic: 1, isBanned: 1 });
userSchema.index({ skillsOffered: 1 });
userSchema.index({ skillsWanted: 1 });

const User = mongoose.model("User", userSchema);

export default User;
