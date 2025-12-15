import express from "express";
import { createCapsule,getCapsules } from "../controllers/capsuleController.js";
const router = express.Router();
router.post("/",createCapsule);
router.get("/",getCapsules);
export default router;