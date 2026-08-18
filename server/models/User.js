import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      default: null,
    },
    profileImage: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      default: null,
    },
    // Capsules created by this user
    capsules: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Capsule",
      },
    ],
    // Capsules shared with this user
    recipientCapsules: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Capsule",
      },
    ],
    // Capsules they collaborated on
    collaboratedCapsules: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Capsule",
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return ;
  }
  this.password = await bcrypt.hash(this.password, 10);
  
});

userSchema.methods.comparePassword = async function(enteredPassword){
  return await bcrypt.compare(enteredPassword,this.password);
};

export const User = mongoose.model("User", userSchema);
