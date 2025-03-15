import axios from "axios";
import { BACKEND_URL } from "../../../config/baseUrls";
import ChatRoom from "../../../components/chatcomponents/ChatRoom";

export async function getRoomId(slug : string){
   try {
        // console.log("My slug", slug);
        const findRoomId = await axios.get(`${BACKEND_URL}/user/room/${slug}`);
        // console.log("data recieved", findRoomId);
        const roomId = findRoomId.data.data.room.id;
        // console.log("roomId", roomId);
        return roomId;
   } catch (error : any) {
        console.log(error);
        return false;
   }

}
// interface params {
//     slug : string
// }
export default async function page( { params }: { params: Promise<{ slug: string }> }){
    const slug =  (await params).slug;
    let roomId = await getRoomId(slug);
    roomId = roomId.toString();
    return (
        <ChatRoom id={roomId}/>
    )
    
}
