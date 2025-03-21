'use client'
import axios from "axios";
import { useParams } from "next/navigation";
import { WS_URL } from "../../../configs/ServerUrls";
import { useEffect, useState } from "react";
import CanvasRoom from "../../../components/CanvasRoom";

export default function page() {
    const params = useParams();
    const roomId = params.roomId || '';
    const [socket, setSocket] = useState<WebSocket>();
    useEffect(() => {
        const ws = new WebSocket(`${WS_URL}?token=$eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiY204ajM0eTZmMDAwMHI2YmNhbDVxank2ZyIsImVtYWlsIjoia3VuYWxAZ21haWwuY29tIiwidXNlcm5hbWUiOiJNZU15c2VsZiJ9LCJpYXQiOjE3NDI1ODAwMTAsImV4cCI6MTc0Mzg3NjAxMH0.GDxDmlOv2o8nctpbzkdI7nntTbBPJ3_loWSn6XvoWqY`);
        setSocket(ws);
        const data = JSON.stringify({
            type: "join_room",
            roomId : Number(roomId)
        });
        console.log(data);
        ws.send(data)
    }, [])
    if(!socket){
        return <div>Loading...</div>
    }
  return (
    <CanvasRoom roomId={roomId as string} socket = {socket}/>
  );
}