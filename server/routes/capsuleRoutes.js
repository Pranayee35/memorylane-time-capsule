import express from "express";
import { 
    createCapsule,
    getCapsules,
    getCapsuleById,
    getCapsuleByAccessToken,
    checkAndUnlockCapsules,
    unlockCapsule,
    addComment,
    addReaction
} from "../controllers/capsuleController.js";
import {protect} from "../middleware/authmiddleware.js";
const router = express.Router();

// Basic CRUD
router.post("/", protect, createCapsule);
router.get("/",protect, getCapsules);
router.get("/access/:token",getCapsuleByAccessToken); // Access via unique token
router.get("/:id", protect, getCapsuleById);

// NEW: Unlock operations
router.post("/check-unlock", checkAndUnlockCapsules);
router.post("/:id/unlock", unlockCapsule);

// NEW: Comments and Reactions
router.post("/:id/comments",protect, addComment);
router.post("/:id/reactions", protect, addReaction);

export default router;