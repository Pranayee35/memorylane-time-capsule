import mongoose from "mongoose";
const mediaSchema = new mongoose.Schema({
    url:{
        type: String,
        requires: true,
    },
    type: {
        type: String,
        enum: ["image","video"],
    },
},{_id: false});
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
  },
  { timestamps: true }
);

export const Capsule = mongoose.model("Capsule", capsuleSchema);