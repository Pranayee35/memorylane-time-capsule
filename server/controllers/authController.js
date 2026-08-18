import {User} from "../models/User.js";
import jwt from "jsonwebtoken";

const generateToken = (userId)=>{
    return jwt.sign(
        {id:userId},
        process.env.JWT_SECRET,
        {
            expiresIn: "7d",
        }
    );
};

export const registerUser = async(req,res)=>{
    try{
        const {username,email,password,fullName} = req.body;
        if(!username||!email||!password){
            return res.status(400).json({
                success:false,
                message:"Username, email and password are required",
            })
        }
        const emailExists = await User.findOne({email});
        if(emailExists){
            return res.status(400).json({
                success:false,
                message:"Email already exists",
            })
        }
        const usernameExists = await User.findOne({username});
        if(usernameExists){
            return res.status(400).json({
                success:false,
                message:"Username already taken",
            })
        }
        const user = await User.create({
            username,
            email,
            password,
            fullName,
        });
        const token = generateToken(user._id);
        res.status(201).json({
            success:true,
            message:"User created successfully",
            token,
            user:{
                id:user._id,
                username:user.username,
                email:user.email,
                fullname:user.fullName,
            },
        });
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message,
        });
    }
};

export const loginUser = async(req,res)=>{
    try{
        const {email,password} = req.body;
        if(!email||!password){
            return res.status(400).json({
                success:false,
                message:"Email and password are required",
            })
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({
                success:false,
                message:"Invalid email",
            })
        }
        const isPasswordValid = await user.comparePassword(password);
        if(!isPasswordValid){
            return res.status(401).json({
                success:false,
                message:"Invalid password",
            })
        }
        const token = generateToken(user._id);
        res.status(200).json({
            success:true,
            message:"Login successful",
            token,
            user:{
                id:user._id,
                username:user.username,
                email:user.email,
                fullname:user.fullname,
            },
        });
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}