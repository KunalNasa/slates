import { roomSchema } from "@slates/common/schemas";
import { client } from "@slates/db/client";
import { Request, Response } from "express";

export async function createRoom(req : Request, res: Response) : Promise<any> {
    try {
        const data = req.body;
        const isValid = roomSchema.safeParse(data.data);
        if(!isValid.success){
            return res.status(400).json({
                error : "Invalid data passed"
            })
        }
        const userId = req.user?._id;
        if(!userId){
            return res.status(401).json({
                error : "Invalid request"
            })
        }
        const isRoomAlreadyMade = await client.room.findFirst({
            where : {
                slug : data.data.name
            }
        })
        if(isRoomAlreadyMade){
            return res.status(400).json({
                error : "Room already exists with this name, please try another one"
            })
        }
        const room = await client.room.create({
            data : {
                slug : data.data.name,
                admindId : userId
            }
        })
        return res.status(201).json({
            data : {
                roomId : room.id
            }
        })
    } catch (error : any) {
        console.log("error creating room", error.message);
        return res.status(500).json({
            error : "Internal server error"
        })
        
    }
    
}