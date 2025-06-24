import {StreamChat} from "stream-chat"
import "dotenv/config";

const apiKey = process.env.YAPTIME_API_KEY
const apiSecret = process.env.YAPTIME_API_SECRET

if(!apiKey || !apiSecret){
    console.error("Please set STREAM_API_KEY and STREAM_API_SECRET in your .env file")
}

const streamClient = StreamChat.getInstance(apiKey,apiSecret);
export const upsertStreamUser = async (userData)=>{
    try{
        await streamClient.upsertUser([userData]);  //upsert mean if data doesnot exist then create it if it is there then update it
        return userData
    }
    catch(error){

        console.error("Error upserting stream user",error);
    }
};

export const generateStreamToken = (userId)=>{
    try{
        //ensure user id is string
        const userIdStr = userId.toString();
        return streamClient.createToken(userIdStr);
    }catch(error){
        console.error("Error generating stream token: ",error);
    }
};

