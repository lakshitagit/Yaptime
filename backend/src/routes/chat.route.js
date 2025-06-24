import express from "express";
import { protectRouter  } from "../middleware/auth.middleware.js";
import { getStreamToken } from "../controllers/chat.controller.js";

const router = express.Router();

//this will generate string token and willl be needed for authentciation
        

router.get("/token",protectRouter,getStreamToken);


export default router;