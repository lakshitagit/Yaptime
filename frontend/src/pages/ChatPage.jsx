import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import useAuthUser from '../hooks/useAuthUser';
import { useQuery } from '@tanstack/react-query';
import { getStreamToken } from '../lib/api';
import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";

import toast from 'react-hot-toast';
import ChatLoader from '../components/ChatLoader';
const YAPTIME_API_KEY = import.meta.env.VITE_STREAM_API_KEY
const ChatPage = () => {
   const {id: targetUserId} = useParams(); //destructure
   console. log(targetUserId);
   const [chatClient, setChatClient] = useState(null);
   const [channel,setChannel]= useState(null);
   const [loading,setLoading] = useState(true);

   const {authUser} = useAuthUser();
   console.log("called auth user from chat page");
   console.log('token is ',authUser._id);
   const {data:tokenData} = useQuery({  //wehn we create a query this will run immediately but maybe we sdont want to run it until we get the user
    queryKey:["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser, //do not run unless auth user is there !! convert to boolean
     })

     
  // console.log(id);

  useEffect(()=>{
    const initChat = async()=>{
      if(!tokenData?.token || !authUser) {
        console.log('token data, ',tokenData.token);
        console.log('token data, ',tokenData);
        console.log('auth user',authUser);
        return;
      }
      try{
        console.log("INitialziing stream chat ..")
        const client = StreamChat.getInstance(YAPTIME_API_KEY)
        await client.connectUser({
          id: authUser._id, //mongodb user
          name: authUser.fullName,
          image: authUser.profilePic,
        },tokenData.token);
        console.log('printing token',tokenData.token);
        
        const channelId = [authUser._id,targetUserId].sort().join("-");
        //why sorted? we want to create a unique channle id by sotting user id to ensure the sAME channel is creted regardelees of who initiated the chat 
        //if i start the chat => channelId : [myId,yourId]
        // if you satrt the chat => channelId: [yourId, myId]

        const currChannel = client.channel("messaging",channelId,{
          members: [authUser._id, targetUserId],
        });

        await currChannel.watch(); //this will listen for any incoming chanegs and work in real time

        setChatClient(client);
        setChannel(currChannel);
        // console.log(client);
      }catch(error){
        toast.error("Could not connect to the chat. Please try again");
      }
      finally{
        setLoading(false);
      }
     }
    initChat()
  },[tokenData,authUser,targetUserId]);
  console.log(loading);
  console.log(chatClient);
  console.log(channel);
  if(loading || !chatClient || !channel) return <ChatLoader />;
  return (
    <div className='h-[93vh]'>
      <Chat client={chatClient}>
        <Channel channel={channel}
        >
          <div className='w-full relative'>
            <Window>
              <ChannelHeader></ChannelHeader>
              <MessageList></MessageList>
              <MessageInput focus></MessageInput>
            </Window>
          </div>
        </Channel>
      </Chat>
    </div>
  )
}



export default ChatPage


/**
 * for channel creation
 * create an instance by putting api key
 * connect user by putting user id, name, image
 * create a channel by putting channel id, members
 * listen for incomming changes
 */