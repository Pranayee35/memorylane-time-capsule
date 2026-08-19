import { Capsule } from "../models/Capsule.js";
import crypto from "crypto";
// ENHANCED: Create capsule with validation and privacy support
export const createCapsule = async(req,res)=>{
    try{
        const {
            title,message,theme, unlockType,unlockDate,recipients,collaborators,media,privacy,eventType
        } = req.body;
        const recipientAccessToken = crypto.randomBytes(32).toString("hex"); // Generate a unique access token for recipients
        // Improved validation
        if(!title || !message || !theme || !unlockType || !recipients){
            return res.status(400).json({message:"Missing required fields: title, message, theme, unlockType, recipients"});
        }

        if(unlockType === "date" && !unlockDate) {
            return res.status(400).json({message:"unlockDate is required when unlockType is 'date'"});
        }

        if(unlockType === "event" && !eventType) {
            return res.status(400).json({message:"eventType is required when unlockType is 'event'"});
        }

        const capsule = await Capsule.create({
            title,
            message,
            theme, 
            unlockType,
            unlockDate: unlockType === "date" ? unlockDate : null,
            eventType: unlockType === "event" ? eventType : null,
            recipients,
            collaborators: collaborators || [],
            media: media || [],
            createdBy:req.user,
            recipientAccessToken,
            privacy: privacy || "private",
            unlocked: false,
            unlockedEmailSent: false
        });

        res.status(201).json({message:"Capsule created successfully", capsule});

    }catch(error){
        console.error("Create capsule error:",error);
        res.status(500).json({message:"Server error", error: error.message});
    }
};

// Get all capsules with filtering
export const getCapsules = async(req,res)=>{
    try{
        const { filter } = req.query; // all, unlocked, locked

        let query = {};
        
        if(filter === "unlocked") {
            query.unlocked = true;
        } else if(filter === "locked") {
            query.unlocked = false;
        }

        const capsules = await Capsule.find({createdBy: req.user}).sort({ createdAt: -1 });
        res.status(200).json(capsules);
        
    } catch (error) {
        console.error("Get capsules error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get capsule by ID with unlock check
export const getCapsuleById = async (req, res) => {
  try {
    const capsule = await Capsule.findById(req.params.id);
    if (!capsule) {
      return res.status(404).json({ message: "Capsule not found" });
    }
    if(capsule.createdBy.toString()!== req.user){
        return res.status(403).json({
            message:"You are not allowed to access this capsule"
        })
    }
    res.json(capsule);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch capsule", error: err.message });
  }
};

// NEW: Check and unlock capsules based on date
export const checkAndUnlockCapsules = async(req,res) => {
    try {
        const now = new Date();
        
        // Find all locked capsules with date-based unlock
        const capsulesWithDateUnlock = await Capsule.find({
            unlocked: false,
            unlockType: "date",
            unlockDate: { $lte: now }
        });

        // Update these capsules to unlocked
        await Capsule.updateMany(
            {
                _id: { $in: capsulesWithDateUnlock.map(c => c._id) }
            },
            { unlocked: true }
        );

        res.json({
            message: `${capsulesWithDateUnlock.length} capsules unlocked`,
            capsules: capsulesWithDateUnlock
        });

    } catch(error) {
        console.error("Unlock check error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// NEW: Manual unlock for testing (should be protected in production)
export const unlockCapsule = async(req,res) => {
    try {
        const { id } = req.params;
        
        const capsule = await Capsule.findByIdAndUpdate(
            id,
            { unlocked: true },
            { new: true }
        );

        if(!capsule) {
            return res.status(404).json({ message: "Capsule not found" });
        }

        res.json({ message: "Capsule unlocked", capsule });

    } catch(error) {
        console.error("Unlock error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// NEW: Add comment to capsule (only after unlock)
export const addComment = async(req,res) => {
    try {
        const { id } = req.params;
        const { text } = req.body;

        if(!text) {
            return res.status(400).json({ message: "text required" });
        }

        const capsule = await Capsule.findById(id);
        if(!capsule) {
            return res.status(404).json({ message: "Capsule not found" });
        }

        if(!capsule.unlocked) {
            return res.status(403).json({ message: "Cannot comment - capsule not yet unlocked" });
        }

        capsule.comments.push({
            createdBy: req.user,
            text 
        });
        await capsule.save();

        res.json({ message: "Comment added", capsule });

    } catch(error) {
        console.error("Add comment error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// NEW: Add reaction to capsule (emoji + user)
export const addReaction = async(req,res) => {
    try {
        const { id } = req.params;
        const { emoji } = req.body;

        if(!emoji) {
            return res.status(400).json({ message: "emoji required" });
        }

        const capsule = await Capsule.findById(id);
        if(!capsule) {
            return res.status(404).json({ message: "Capsule not found" });
        }

        if(!capsule.unlocked) {
            return res.status(403).json({ message: "Cannot react - capsule not yet unlocked" });
        }

        // Check if this emoji reaction exists
        const existingReaction = capsule.reactions.find(r => r.emoji === emoji);
        
        if(existingReaction) {
            // Check if user already reacted with this emoji
            if(!existingReaction.users.includes(req.user)) {
                existingReaction.users.push(req.user);
                existingReaction.count += 1;
            }
        } else {
            // Create new reaction
            capsule.reactions.push({ emoji, users: [req.user], count: 1 });
        }

        await capsule.save();
        res.json({ message: "Reaction added", capsule });

    } catch(error) {
        console.error("Add reaction error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getCapsuleByAccessToken = async(req,res)=>{
    try{
        const {token} = req.params;
        const capsule = await Capsule.findOne({recipientAccessToken:token});
        if(!capsule){
            return res.status(404).json({
                message:"Invalid or expired capsule link"
            });
        }
        if(!capsule.unlocked){
            return res.status(404).json({
                message:"This capsule is not unlocked yet.Please check back later"
            });
        }
        res.status(200).json(capsule);

    }catch(error){
        console.error("Access capsule error:",error);
        res.status(500).json({
            message:"Server error",
            error:error.message
        });
    }
};