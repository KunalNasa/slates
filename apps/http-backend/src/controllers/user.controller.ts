import { APIResponse, Chat, ErrorResponse, Room } from "@slates/backend-common/config";
import { roomSchema } from "@slates/common/schemas";
import { client } from "@slates/db/client";
import { Request, Response } from "express";

export async function createRoom(req : Request, res: Response) : Promise<any> {
    try {
        const data = req.body;
        console.log(data);
        const isValid = roomSchema.safeParse(data);
        if(!isValid.success){
            const response : ErrorResponse = {
                success : false,
                message : "Invalid data passed"
            }
            return res.status(400).json(response);
        }
        const userId = req.user?.id;
        if(!userId){
            const response : ErrorResponse = {
                success : false,
                message : "Unauthorised Request",
            }
            return res.status(401).json(response);
        }
        const isRoomAlreadyMade = await client.room.findFirst({
            where : {
                slug : data.name
            }
        })
        if(isRoomAlreadyMade){
            const response : ErrorResponse<null> = {
                success : false,
                message : "Room already exists with this name, please try another name",
                data : null
            }
            return res.status(400).json(response);
        }
        const room = await client.room.create({
            data : {
                slug : data.name,
                adminId : userId
            }
        })
        // change the typeof room to Room after fixing
        const response : APIResponse<typeof room> = {
            success : true,
            message : "Room created Successfully",
            data : room
        }
        return res.status(201).json(response);
    } catch (error : any) {
        console.log("error creating room", error.message);
        const response : ErrorResponse<null> = {
            success : false,
            message : "Internal Server Error"
        }
        return res.status(500).json(response);
    }
    
}

export async function fetchChats(req : Request, res: Response) : Promise<any> {
    try {
        const roomId = Number(req.params.roomId);
        const messages = await client.chat.findMany({
            where: {
            roomId: roomId
            },
            take: 50,
            orderBy: {
                createdAt: 'desc'
            }
        });
        const response : APIResponse<Chat[]> = {
            success : true,
            message : "Chats fetched successfully",
            data : messages
        }
        return res.status(201).json(response);
        
    } catch (error : any) {
        console.log("Error in fetching chats", error.message);
        const response : ErrorResponse<null> = {
            success : false,
            message : "Internal Server Error",
        }
        return res.status(500).json(response);
    }
    
}

export async function verifySlug(req : Request, res: Response) : Promise<any> {
    try {
        const slug = req.params.slug;
        const room = await client.room.findFirst({
            where : {
                slug
            }
        })
        if(!room){
            const response : ErrorResponse<null> = {
                success : false,
                message : "No room found with this name"
            }
            return res.status(404).json(response);
        }
        // TODO: Fix the type later
        const response : APIResponse<typeof room> = {
            success : true,
            message : "Fetched room details successfully",
            data : room
        }
        return res.status(200).json(response);

    } catch (error : any) {
        console.log(error.message);
        const response : ErrorResponse<null> = {
            success : false,
            message : "Internal Server Error",
        }
        return res.status(500).json(response);
    }
    
}