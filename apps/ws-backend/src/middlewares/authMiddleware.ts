import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { User, userStore } from "../models/user.store.js";
import WebSocket from "ws";

dotenv.config();

export function authenticateUser(ws: WebSocket, request: any): User | null {
    const url = request.url;
    if (!url) {
        ws.close();
        return null;
    }

    const queryParams = new URLSearchParams(url.split("?")[1]);
    const token = queryParams.get("token");
    if (!token) {
        ws.close();
        return null;
    }

    const userId = checkUser(token);
    if (!userId) {
        ws.close();
        return null;
    }

    const user: User = { ws, userId, rooms: [] };
    userStore.addUser(user);
    return user;
}

function checkUser(token: string): string | false {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        return decoded && (decoded as JwtPayload).user ? (decoded as JwtPayload).user.id : false;
    } catch (error: any) {
        console.log(error.message);
        return false;
    }
}
