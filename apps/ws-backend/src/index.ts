import  {WebSocket, WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken"
import dotenv from "dotenv"
import { client } from "@slates/db/client";

dotenv.config();
const wss = new WebSocketServer( { port : 8080});

interface User {
    ws: WebSocket,
    rooms: number[],
    userId: string
}
const users : User[] = [];  

function checkUser(token : string) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        console.log("Jwt token:", decoded);
        if(!decoded || !(decoded as JwtPayload).user){
            return false;
        }
        console.log((decoded as JwtPayload).user._id);
        return (decoded as JwtPayload).user._id;
    } catch (error : any) {
        console.log(error.message);
        return false;
    }
}

wss.on('connection', function(ws, request){
    const url = request.url;
    if(!url){
        return;
    }

    const queryParams = new URLSearchParams(url.split('?')[1]);
    const token = queryParams.get('token');
    if(!token){
        ws.close();
        return;
    }
    const userId = checkUser(token);
    if(!userId){
        ws.close();
        return;
    }
    users.push({
        ws : ws,
        userId,
        rooms : [],
    })

    // req -> http://localhost:8080?token=myToken
    ws.on('message', async (data) => {
        // {type : "join_room", roomId : 1}
       try {
         const user = users.find(x => x.ws === ws);
         const parsedData = JSON.parse(data.toString()); 
        //  console.log(user);
         if(!user){
            return;
         }
         if(parsedData.type === "join_room"){
            //  if(user.rooms.find(x => x === parsedData.roomId)){
            //     console.log("Pehle se hai");
            //      return;
            //  }
            user.rooms.push(parsedData.roomId);
            console.log(user, "joined", user.rooms);
            //  console.log(users);
         }else if(parsedData.type === "leave_room"){
             if(!(user.rooms.find(x => x === parsedData.roomId))){
                 return;
             }else{
                 user.rooms = user.rooms.filter(x => { return x !== parsedData.roomId});
             }
         }else if(parsedData.type === "chat"){
            // console.log(users);
            const roomId = parsedData.roomId;
            const numericId = Number(roomId);
            const message = parsedData.message;
            console.log(parsedData);
            await client.chat.create({
                data : {
                    roomId : numericId,
                    message,
                    userId
                }
            })
            console.log("all users",users);
            users.forEach(user => {
                if (user.rooms.includes(roomId)) {
                    console.log(`📡 Sending to user ${user.userId}: ${message}`);
                    
                    if (user.ws.readyState === WebSocket.OPEN) {
                        console.log("Jaa raha hai")
                        user.ws.send(JSON.stringify({
                            type: "chat",
                            message: message,
                            roomId: roomId
                        }));
                    } else {
                        console.error(`🚨 WebSocket CLOSED for user ${user.userId}, skipping send.`);
                    }
                }
            });
            
         }
       } catch (error: any) {
            console.log(error.message);
       }

    })
})
