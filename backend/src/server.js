import express from "express";
// import dotenv from "dotenv";
import "dotenv/config";
import authRouter from "./routes/auth.route.js"
import userRoutes from "./routes/user.route.js"
import chatRoutes from "./routes/chat.route.js"
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/db.js";
import cors from "cors";
// dotenv.config();
const app = express();
//nodemon is used to reflect the changes immediately
const PORT = process.env.PORT

app.use(express.json());



app.use(cors({
     origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials:true, //allow frontend to send the cookies
}));

app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/users", userRoutes);
app.use("/api/chat",chatRoutes);
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    connectDB();
})
