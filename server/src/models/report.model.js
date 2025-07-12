import mongoose from "mongoose";

const mongoose = require('mongoose');

// User Model
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  location: {
    type: String,
    trim: true
  },
  profilePhoto: {
    type: String, // URL to image
  },
  bio: {
    type: String,
    maxlength: 500
  },
  availability: {
    type: [String],
    enum: ['weekends', 'weekdays', 'evenings', 'mornings', 'afternoons', 'flexible'],
    default: ['flexible']
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  skillsOffered: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skills'
  }],
  skillsWanted: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skills'
  }],
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  isBanned: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
});

// Skills Model
const skillsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    maxlength: 200
  },
  category: {
    type: String,
    enum: ['Technology', 'Design', 'Business', 'Language', 'Arts', 'Sports', 'Music', 'Cooking', 'Other'],
    required: true
  },
  isGlobal: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isApproved: {
    type: Boolean,
    default: true // Admin created skills are auto-approved
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Swap Request Model
const swapRequestSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  skillOffered: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skills',
    required: true
  },
  skillRequested: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skills',
    required: true
  },
  message: {
    type: String,
    maxlength: 500
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
    default: 'pending'
  },
  proposedSchedule: {
    startDate: Date,
    endDate: Date,
    timeSlots: [String] // e.g., ['weekends', 'evenings']
  },
  duration: {
    type: String,
    enum: ['1-2 hours', '3-5 hours', '1 day', '1 week', '2 weeks', '1 month', 'flexible']
  },
  meetingPreference: {
    type: String,
    enum: ['online', 'in-person', 'hybrid'],
    default: 'online'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  acceptedAt: Date,
  completedAt: Date,
  rejectedAt: Date
});

// Feedback/Rating Model
const feedbackSchema = new mongoose.Schema({
  swapRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SwapRequest',
    required: true
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reviewee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    maxlength: 500
  },
  skillTaught: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skills',
    required: true
  },
  categories: {
    communication: {
      type: Number,
      min: 1,
      max: 5
    },
    knowledge: {
      type: Number,
      min: 1,
      max: 5
    },
    punctuality: {
      type: Number,
      min: 1,
      max: 5
    },
    helpfulness: {
      type: Number,
      min: 1,
      max: 5
    }
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Notification Model
const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['platform', 'swap_request', 'swap_accepted', 'swap_rejected', 'swap_completed', 'feedback_received', 'system'],
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function() {
      return this.type !== 'platform';
    }
  },
  isGlobal: {
    type: Boolean,
    default: false
  },
  relatedModel: {
    type: String,
    enum: ['SwapRequest', 'Feedback', 'User']
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: Date,
  isActive: {
    type: Boolean,
    default: true
  }
});

// User Notification Status Model
const userNotificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  notification: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Notification',
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  isDismissed: {
    type: Boolean,
    default: false
  },
  dismissedAt: Date
});

// Report Model (for admin analytics)
const reportSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['user_activity', 'swap_stats', 'feedback_summary', 'skill_popularity'],
    required: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  generatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dateRange: {
    from: Date,
    to: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Report = new mongoose.model("Report", reportSchema);

export default Report;