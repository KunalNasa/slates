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
        }else if (parsedData.type === "notification"){
            inviteToRoom(user, parsedData.username, parsedData.email, numericRoomId);
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
            user.ws.send(JSON.stringify({ type: "unauthorised", message: "Access Denied" }));
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

async function inviteToRoom(user: User, username: string, email: string, roomId: number) {
    if (user.ws.readyState !== WebSocket.OPEN) {
        return;
    } 
    try {
        // Find the user by username and email
        const findUser = await client.user.findFirst({
            where: {
                AND: [{ username }, { email }]
            }
        });

        // If user does not exist, return early
        if (!findUser) {
            return user.ws.send(JSON.stringify({
                type: "error",
                message: "User not found"
            }));
        }

        // Check if the user is already in the room
        const isUserAlreadyInRoom = await client.participants.findFirst({
            where: {
                roomId,
                userId: findUser.id
            }
        });

        // If user is already in the room, return early
        if (isUserAlreadyInRoom) {
            return user.ws.send(JSON.stringify({
                type: "error",
                message: "User is already a participant in the room"
            }));
        }

        // Invite the user to the room
        const inviteUser = await client.participants.create({
            data: {
                roomId,
                userId: findUser.id,
                canRead: true,
                canWrite: true
            }
        });

        // Send success message if the user was invited
        if (inviteUser) {
            console.log(inviteUser);
            return user.ws.send(JSON.stringify({
                type: "success",
                message: "User invited successfully"
            }));
        }

    } catch (error: any) {
        console.error("Invite Error:", error);

        user.ws.send(JSON.stringify({
            type: "error",
            message: "An error occurred while inviting the user",
            details: error.message
        }));
    }
}
