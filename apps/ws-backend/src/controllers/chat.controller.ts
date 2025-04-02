import { client } from "@slates/db/client";
import { User, userStore } from "../models/user.store.js";
import { addShapesToQueue } from "../configs/BullMq.js";


export async function handleChat(user: User, roomId: number, message: string) {
    addShapesToQueue({roomId, message, userId : user.userId});
    // await client.chat.create({
    //     data: {
    //         roomId,
    //         message,
    //         userId: user.userId
    //     }
    // });

    userStore.broadcastToRoom(roomId, {
        type: "chat",
        message,
        roomId
    });
}
