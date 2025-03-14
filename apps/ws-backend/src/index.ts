import { WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken"
const wss = new WebSocketServer( { port : 8080});

wss.on('connection', function(ws, request){
    const url = request.url;
    if(!url){
        return;
    }
    // req -> http://localhost:8080?token=myToken
    const queryParams = new URLSearchParams(url.split('?')[1]);
    const token = queryParams.get('token');
    if(!token){
        return;
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    if(!decoded || !(decoded as JwtPayload).userId){
        ws.close();
        return;
    }
    ws.on('message', (data) => {
        ws.send(data);
    })
})
