import express from "express";
import { createCapsule } from "../controllers/capsuleController.js";
const router = express.Router();
router.post("/",createCapsule);
export default router;