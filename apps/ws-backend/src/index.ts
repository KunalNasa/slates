// import  {WebSocket, WebSocketServer } from "ws";
// import jwt, { JwtPayload } from "jsonwebtoken"
// import dotenv from "dotenv"
// import { client } from "@slates/db/client";
// import { ErrorResponse } from "@slates/backend-common/config";

// dotenv.config();
// const wss = new WebSocketServer( { port : 8080});

// interface User {
//     ws: WebSocket,
//     rooms: number[],
//     userId: string
// }
// const users : User[] = [];  

// function checkUser(token : string) {
//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
//         if(!decoded || !(decoded as JwtPayload).user){
//             return false;
//         }
//         // console.log((decoded as JwtPayload).user.id);
//         return (decoded as JwtPayload).user.id;
//     } catch (error : any) {
//         console.log(error.message);
//         return false;
//     }
// }

// wss.on('connection', function(ws, request){
//     const url = request.url;
//     if(!url){
//         return;
//     }

//     const queryParams = new URLSearchParams(url.split('?')[1]);
//     const token = queryParams.get('token');
//     if(!token){
//         ws.close();
//         return;
//     }
//     const userId = checkUser(token);
//     if(!userId){
//         ws.close();
//         return;
//     }
//     users.push({
//         ws : ws,
//         userId,
//         rooms : [],
//     })

//     // req -> http://localhost:8080?token=myToken
//     ws.on('message', async (data) => {
//         // {type : "join_room", roomId : 1}
//        try {
//          const user = users.find(x => x.ws === ws);
//          const parsedData = JSON.parse(data.toString()); 
//          const numericRoomId = Number(parsedData.roomId);
//         //  console.log(user);
//          if(!user){
//             console.log("No User Found")
//             return;
//          }
//          if(parsedData.type === "join_room"){
//             const isUserAllowedToJoin = await client.participants.findFirst({
//                 where :{
//                     roomId : numericRoomId,
//                     userId : userId
//                 }
//             })
//             if(!isUserAllowedToJoin){
//                 const errorMessage : ErrorResponse = {
//                     success : false,
//                     message : "You are not invited to join this room."
//                 }
//                 return errorMessage;
//             }
//             if(user.rooms.find(x => x === numericRoomId)){
//                 return;
//             }
//             user.rooms.push(numericRoomId);            
//             // console.log(userId, "joined", user.rooms);
//          }else if(parsedData.type === "leave_room"){
//              if(!(user.rooms.find(x => x === numericRoomId))){
//                 console.log("No such room joined by user");
//                  return;
//              }else{
//                  user.rooms = user.rooms.filter(x => { return x !== numericRoomId});
//              }
//          }else if(parsedData.type === "chat"){
//             // console.log(users);
//             const message = parsedData.message;
//             console.log(parsedData);
//             await client.chat.create({
//                 data : {
//                     roomId : numericRoomId,
//                     message,
//                     userId
//                 }
//             })
//             console.log("all users",users);
//             users.forEach(user => {
//                 if (user.rooms.includes(numericRoomId)) {
//                     console.log(`📡 Sending to user ${user.userId}: ${message}`);
                    
//                     if (user.ws.readyState === WebSocket.OPEN) {
//                         console.log("Jaa raha hai")
//                         user.ws.send(JSON.stringify({
//                             type: "chat",
//                             message: message,
//                             roomId: numericRoomId
//                         }));
//                     } else {
//                         console.error(`🚨 WebSocket CLOSED for user ${user.userId}, skipping send.`);
//                     }
//                 }
//             });
            
//          }
//        } catch (error: any) {
//             console.log(error.message);
//        }

//     })
// })


import './configs/websocketServer.js'
import './configs/BullMq.js'

console.log("WebSocket server is running on ws://localhost:8080");
