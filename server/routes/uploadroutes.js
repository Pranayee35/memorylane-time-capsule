import express from "express";
import upload from "../utils/multer.js";
import { uploadMedia } from "../controllers/uploadController.js";

const router = express.Router();

router.post("/", upload.single("file"), uploadMedia);

export default router;
