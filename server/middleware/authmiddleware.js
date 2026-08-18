import jwt from "jsonwebtoken";
export const protect = (req,res,next)=>{
    try{const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer")){
        return res.status(401).json({
            success:false,
            message:"No authentication token provided or token is invalid",
        })
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    req.user = decoded.id;
    next();
    }catch(error){
        return res.status(401).json({
            success:false,
            message:"invalid or expired token",
        })
    }
}