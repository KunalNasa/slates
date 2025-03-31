'use client'
import { useParams } from "next/navigation";
import { WS_URL } from "../../../../configs/ServerUrls";
import { useEffect, useState } from "react";
import CanvasRoom from "../../../../components/CanvasRoom";

export default function page() {
    const params = useParams();
    const roomId = params.roomId || '';
    const [socket, setSocket] = useState<WebSocket>();
    useEffect(() => {
        const token = localStorage.getItem('jwt');
        const ws = new WebSocket(`${WS_URL}?token=${token}`);
        ws.onopen = () => {
            setSocket(ws);
            const data = JSON.stringify({
                type: "join_room",
                roomId,
            });
            ws.send(data)
        };        
        
    }, [])
    useEffect(() => {

    }, [socket])
    if(!socket){
        return <div>Loading...</div>
    }
  return (
    <div className="bg-black">
    <CanvasRoom roomId={roomId as string} socket = {socket}/>
    </div>
  );
}