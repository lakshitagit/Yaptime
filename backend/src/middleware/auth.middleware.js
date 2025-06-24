import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { logout } from "../controllers/auth.controller.js";

export const protectRouter = async(req,res,next)=>{
    try{
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).json({message:"Unauthorized - No token provided"});
        }
        const decode = jwt.verify(token,process.env.JWT_SECRET_KEY);
        if(!decode){
            return res.status(401).json({message:"Unauthorized - Token is invalid"});
        }
        const user = await User.findById(decode.userId).select("-password");
        if(!user){
            return res.status(401).json({message:"Unauthorized - User not found"});
        }
        req.user = user;
        console.log("user id ",user);
        console.log("req.user  ",req.user);
        next();
    }

    

    catch(error){
        console.log("Error in protectRoute middleware: ",error);
        res.status(500).json({message:"Internal server error"});
    }
}