import uploadRoutes from "./routes/uploadroutes.js";

import express from "express";
import cors from "cors";
// import dotenv from "dotenv";
import mongoose from "mongoose";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/upload", uploadRoutes);

mongoose
.connect(process.env.MONGO_URI)
.then(()=>console.log("mongodb connected"))
.catch((err)=>console.error("Mongodb connection error",err)
);
app.get("/",(req,res)=>{
    res.send("Backend is running");
});
const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
    
});