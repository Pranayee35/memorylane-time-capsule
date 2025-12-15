import express from "express";
import { createCapsule,getCapsules,getCapsuleById } from "../controllers/capsuleController.js";
const router = express.Router();
router.post("/",createCapsule);
router.get("/",getCapsules);

router.get("/:id", getCapsuleById);
export default router;