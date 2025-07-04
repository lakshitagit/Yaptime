import { upsertStreamUser } from '../lib/stream.js';
import User from '../models/User.js';
import jwt from "jsonwebtoken";
export async function signup(req,res){
    const {email,password,fullName} = req.body;

    try{
        if(!email || !password || !fullName){
            return res.status(400).json({message:"All the fields are required"});
        }

        if(password.length<6){
            return res.status(400).json({message:"Password must be at least 6 characters long"});
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({message:"Invalid email"});
        }
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"Email already exists, please use a different one"});
        }

        const idx = Math.floor(Math.random()*100)+ 1;
        const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`

        const newUser = await User.create(
           { email,
            fullName,
            password,
            profilePic:randomAvatar,
        }
        );

        try{
            await upsertStreamUser({
            id:newUser._id.toString(),
            name:newUser.fullName,
            image:newUser.profilePic || "",
        });
        console.log(`Stream user created for ${newUser.fullName}`);
        }
        catch(error){
            console.log("Error creating stream user: ",error);
        }

        const token = jwt.sign({userId:newUser._id},process.env.JWT_SECRET_KEY,{
            expiresIn:"7d"
        })

        res.cookie("jwt",token,{
            maxAge: 7* 24 * 60 * 60 * 1000,
            httpOnly:true, //prevent XSS attacks
            sameSite:"strict", //prevent CSRF 
            secure:process.env.NODE_ENV === 'production'
        })
        res.status(201).json({success:true, user:newUser})
    }
    catch(error){
        console.log("Error in signup controller",error);
        res.status(500).json({message:"Internal server error"});
    }
}

export async function login(req,res){
    // req.res.send("Login Route");
    try{
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({message:"All the fields are required"});
        }
        const user = await User.findOne({email});
        if(!user) return res.status(404).json({message:"Invalid email or password"});

        const isPasswordCorrect = await user.matchPassword(password);
        if(!isPasswordCorrect) return res.status(401).json({message:"Invalid email or password"});

        const token = jwt.sign({
            userId:user._id
        },
        process.env.JWT_SECRET_KEY,{
            expiresIn:"7d",
        }
    );
    res.cookie("jwt",token,{
        maxAge: 7* 24 * 60 * 60 * 1000,
        httpOnly:true, //prevent XSS attacks
        sameSite:"strict", //prevent CSRF
        secure:process.env.NODE_ENV === 'production'

    });
    res.status(200).json({success:true,user} );
    }
    catch(error){
        console.log("Error in login controller", error.message);
        res.status(500).json({message:"Internal server error"});
    }
}

export async function logout(req,res){
    // req.res.send("Logout Route");
    res.clearCookie("jwt");
    res.status(200).json({success:true,message:"Logged out successfully"});
}

export async function onboard(req,res){
    console.log("hrbfifbi",req.user);
    try{
        const userId = req.user.id;
        const {fullName,bio,nativeLanguage,learningLanguage,location,profilePic} = req.body;

        if(!fullName || !bio || !nativeLanguage || !learningLanguage || !location || !profilePic){
            return res.status(400).json({message:"All the fields are required",
                missingFields:[
                    !fullName && "fullName",
                    !bio && "bio",
                    !nativeLanguage && "nativeLanguage",
                    !learningLanguage && "learningLanguage",
                    !location && "location",
                    !profilePic && "profilePic",
                ].filter(Boolean),
            });
        }
        const updatedUser =await User.findByIdAndUpdate(userId,{
            ...req.body,  //get everything that we have in req.body instead of typing all the values manually
            isOnboarded: true,
        },{new:true})

        if(!updatedUser) return res.status(404).json({message:"User not found"});


        //update user info in stream
        try{
                    await upsertStreamUser({
            id: updatedUser._id.toString(),
            name: updatedUser.fullName,
            image:updatedUser.profilePic || "",
        })
        console.log(`Stream user updatede after onboarding for ${updatedUser.fullName}`);
        }
        catch(error){
            console.log("Error updating stream user during onboarding: ",error.message);
        }
        return res.status(200).json({success:true,user:updatedUser});
    }
    catch(error){
        console.error("Onboarding error: ",error);
        res.status(500).json({message:"Internal server error"});
    }
}
