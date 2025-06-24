import express from "express";
import { login, logout, onboard, signup} from "../controllers/auth.controller.js";
import { protectRouter } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup",signup);

router.post("/login",login);

router.post("/logout",logout);

router.post("/onboarding",protectRouter, onboard);

router.get("/me",protectRouter,(req,res)=>{
    res.status(200).json({success:true,user:req.user});
})
export default router;