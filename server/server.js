import uploadRoutes from "./routes/uploadroutes.js";
import capsuleRoutes from "./routes/capsuleRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
// NEW: Import scheduler
import { initializeScheduler } from "./utils/scheduler.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/upload", uploadRoutes);
app.use("/api/capsules", capsuleRoutes);
app.use("/api/auth",authRoutes);
// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    
    // NEW: Start scheduler after DB connection
    initializeScheduler();
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Health check endpoint
app.get("/", (req, res) => {
  res.send("✅ MemoryLane Backend is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});