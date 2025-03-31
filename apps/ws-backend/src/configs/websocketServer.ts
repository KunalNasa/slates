import { WebSocketServer, WebSocket } from "ws";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import { handleMessage } from "../controllers/room.controller.js";


export const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws, request) => {
    const user = authenticateUser(ws, request);
    if (!user) return;
    
    ws.on("message", async (data) => {
        handleMessage(user, data);
    });

    ws.on("close", () => {
        console.log(`User ${user.userId} disconnected`);
    });
});
