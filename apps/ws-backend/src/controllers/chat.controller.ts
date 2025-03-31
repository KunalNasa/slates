import { client } from "@slates/db/client";
import { User, userStore } from "../models/user.store.js";


export async function handleChat(user: User, roomId: number, message: string) {
    await client.chat.create({
        data: {
            roomId,
            message,
            userId: user.userId
        }
    });

    userStore.broadcastToRoom(roomId, {
        type: "chat",
        message,
        roomId
    });
}
