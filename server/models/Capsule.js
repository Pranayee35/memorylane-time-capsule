import mongoose from "mongoose";

// NEW: Enhanced media schema with audio support
const mediaSchema = new mongoose.Schema({
    url:{
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ["image","video","audio"],
    },
    resource_type: {
        type: String,
        default: "auto"
    }
},{_id: true});

// NEW: Comment schema
const commentSchema = new mongoose.Schema({
    createdBy: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// NEW: Reaction schema
const reactionSchema = new mongoose.Schema({
    emoji: {
        type: String,
        required: true
    },
    count: {
        type: Number,
        default: 1
    },
    users: [String]
}, {_id: true});

const capsuleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
    },

    theme: {
      type: String,
      required: true,
    },

    // NEW: Track who created the capsule
    createdBy: {
      type: String,
      required: true
    },

    recipientAccessToken: {
      type: String,
      unique: true,
      sparse: true
   },

    unlockType: {
      type: String,
      enum: ["date", "event"],
      required: true,
    },

    unlockDate: {
      type: Date,
      required: function () {
        return this.unlockType === "date";
      },
    },

    // NEW: Event-based unlock fields
    eventType: {
      type: String,
      default: null
    },

    media: [mediaSchema], 
    
    recipients: [
      {
        type: String,
        required: true,
      },
    ],

    collaborators: [
      {
        type: String,
      },
    ],

    unlocked: {
      type: Boolean,
      default: false,
    },

    // NEW: Privacy control
    privacy: {
      type: String,
      enum: ["public", "private", "recipients"],
      default: "private"
    },

    // NEW: Comments and reactions (post-unlock)
    comments: [commentSchema],
    reactions: [reactionSchema],

    // NEW: Scheduled unlock email sent or not
    unlockedEmailSent: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export const Capsule = mongoose.model("Capsule", capsuleSchema);