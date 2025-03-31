import { WebSocket } from "ws";

export interface User {
    ws: WebSocket;
    rooms: number[];
    userId: string;
}

class UserStore {
    private users: User[] = [];

    addUser(user: User) {
        this.users.push(user);
    }

    removeUser(ws: WebSocket) {
        this.users = this.users.filter((user) => user.ws !== ws);
    }

    getUsersInRoom(roomId: number) {
        return this.users.filter((user) => user.rooms.includes(roomId));
    }

    broadcastToRoom(roomId: number, message: object) {
        this.getUsersInRoom(roomId).forEach((user) => {
            if (user.ws.readyState === WebSocket.OPEN) {
                user.ws.send(JSON.stringify(message));
            }
        });
    }
}

export const userStore = new UserStore();
