import express from "express";
import { protectRouter } from "../middleware/auth.middleware.js";
import { acceptFriendRequest, declineFriendRequest, getFriendRequest, getMyFriends, getOutgoingFriendReqs, getRecommendedUsers, sendFriendRequest } from "../controllers/user.controller.js";
const router  = express.Router();
//apply auth middleware to all routes
router.use(protectRouter);
        


router.get("/",getRecommendedUsers)
router.get("/friends",getMyFriends)
router.post("/friend-request/:id",sendFriendRequest);
router.put("friend-request/:id/accept",acceptFriendRequest);
router.get("/friend-requests",getFriendRequest);
router.get("/decline-friend-request",declineFriendRequest);
router.get("/outgoing-friend-requests",getOutgoingFriendReqs);
export default router;