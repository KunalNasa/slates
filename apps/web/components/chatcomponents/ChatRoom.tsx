import axios from "axios";
import { BACKEND_URL } from "../../config/baseUrls";
import ChatRoomClient from "./ChatRoomClient";

export async function getChats(roomId : string) {
    try {
        const getData = await axios.get(`${BACKEND_URL}/user/chats/${roomId}`);
        const chats = getData.data.data.messages;
        return chats;
    } catch (error : any) {
        console.log(error.message);
        return false;
    }
}

export default async function ChatRoom({id} : {id : string}) {
    const chats  = await getChats(id);
    // console.log("My chats", chats);
  return (
        <ChatRoomClient id={id} messages={chats} />
  );
}