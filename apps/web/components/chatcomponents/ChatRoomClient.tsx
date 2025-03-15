"use client";
import { useEffect, useState } from "react";
import { useSocket } from "../../hooks/useSocket";

export default function ChatRoomClient({
    messages,
    id
}: {
    messages: { message: string }[],
    id: string
}) {
    const [chats, setChats] = useState(messages);
    const [currentMessage, setCurrentMessage] = useState<string>("");
    const { socket, loading } = useSocket();

    useEffect(() => {
        if (!socket || loading) return;

        socket.send(JSON.stringify({
            type: "join_room",
            roomId: Number(id)
        }));

        // Define handleMessage inside useEffect to avoid stale state
        const handleMessage = (event: MessageEvent) => {
            const parsedData = JSON.parse(event.data);
            if (parsedData.type === "chat") {
                setChats((prevChats) => [...prevChats, { message: parsedData.message }]);
            }
        };

        socket.addEventListener("message", handleMessage);

        return () => {
            socket.removeEventListener("message", handleMessage);
        };
    }, [id, socket, loading]); // Dependencies ensure it updates when socket changes

    const sendMessage = () => {
        if (!socket || socket.readyState !== WebSocket.OPEN) {
            console.warn("⚠️ Socket not open yet!");
            return;
        }
    
        socket.send(JSON.stringify({
            type: "chat",
            roomId: id,
            message: currentMessage
        }));
    
        setCurrentMessage(""); // Clear input after sending
    };
    

    return (
        <div>
            {chats.map((item, idx) => (
                <div key={idx}>{item.message}</div>
            ))}
            <input 
                value={currentMessage} 
                onChange={(e) => setCurrentMessage(e.target.value)} 
                type="text" 
                placeholder="Enter message" 
            />
            <button type="submit" onClick={sendMessage}>Send message</button>
        </div>
    );
}
