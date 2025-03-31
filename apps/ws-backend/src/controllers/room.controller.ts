import { client } from "@slates/db/client";
import WebSocket from "ws";
import { handleChat } from "./chat.controller.js";
import { User } from "../models/user.store.js";

export async function handleMessage(user: User, data: any) {
    try {
        const parsedData = JSON.parse(data.toString());
        const numericRoomId = Number(parsedData.roomId);

        if (parsedData.type === "join_room") {
            await joinRoom(user, numericRoomId);
        } else if (parsedData.type === "leave_room") {
            leaveRoom(user, numericRoomId);
        } else if (parsedData.type === "chat") {
            handleChat(user, numericRoomId, parsedData.message);
        }
    } catch (error: any) {
        console.log(error.message);
    }
}

async function joinRoom(user: User, roomId: number) {
    const isUserAllowed = await client.participants.findFirst({
        where: { roomId, userId: user.userId }
    });
    if (!isUserAllowed) {
        console.log(`Access Denied for user ${user.userId} to room ${roomId}`);
        if (user.ws.readyState === WebSocket.OPEN) {
            user.ws.send(JSON.stringify({ success: false, message: "Access Denied" }));
        } else {
            console.log("WebSocket not open, cannot send Access Denied message");
        }
        return;
    }

    if (!user.rooms.includes(roomId)) {
        user.rooms.push(roomId);
        console.log(`User ${user.userId} joined room ${roomId}`);
    }
}

function leaveRoom(user: User, roomId: number) {
    user.rooms = user.rooms.filter((id) => id !== roomId);
    console.log(`User ${user.userId} left room ${roomId}`);
}
