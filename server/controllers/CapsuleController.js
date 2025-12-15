import { Capsule } from "../models/Capsule";
export const createCapsule = async(req,res)=>{
    try{
        const {
            title,message,theme, unlockType,unlockDate,recipients,collaborators,media,
        } = req.body;
        if(!title || !message || !theme || !unlockType || !recipients){
            return res.status(400).json({message:"Missing required fiels"});
        }
        const capsule = await Capsule.create({
            title,message,theme, unlockType,unlockDate,recipients,collaborators,media,
        });
        res.status(201).json({message:"capsule created successfully",capsule});

    }catch(error){
        console.error("Create capsule error:",error);
        res.status(500).json({message:"Server error"});
    }
};