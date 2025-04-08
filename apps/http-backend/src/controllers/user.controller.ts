import { APIResponse, Chat, ErrorResponse, Participant, Room } from "@slates/backend-common/config";
import { DisplayRoomType, roomSchema } from "@slates/common/schemas";
import { client } from "@slates/db/client";
import { Request, Response } from "express";

export async function createRoom(req : Request, res: Response) : Promise<any> {
    try {
        const data = req.body;
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
        const participants = await client.participants.create({
            data : {
                userId,
                canRead : true,
                canWrite : true,
                roomId : room.id
            }
        });
        if(!participants || !room){
            const response : ErrorResponse = {
                success : false,
                message : "Failed to create room",
            }
            return res.status(500).json(response);
        }
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
            take: 1000,
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
        const userId = req.user?.id;
        if(userId !== room.adminId){
            const findParticipant = await client.participants.findFirst({
                where : {
                    userId : userId,
                    roomId : room.id
                }
            })
            if(!findParticipant){
                const response : ErrorResponse = {
                    success : false,
                    message : "You are not allowed to join this room"
                }
                return res.status(400).json(response);
            }
        }
        

        const response : APIResponse<Room> = {
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


export async function searchUsers(req : Request, res: Response) : Promise<any> {
    try {
        const query = req.query.query;
        const users = await client.user.findMany({
            where: {
            OR: [
                { username: { contains: query as string, mode: 'insensitive' } },
                { email: { contains: query as string, mode: 'insensitive' } }
            ]
            },
            take: 50,
            select : {
                username : true,
                email:  true,
                name : true,
                avatar : true
            }
        });
        return res.status(200).json({
            success : true,
            message : "Users fetched",
            data : users
        })
    } catch (error) {
        
    }
}

export async function getUserCreatedRooms(req: Request, res: Response) : Promise<any> {
    try {
        const userId = req.user?.id;
        const rooms = await client.room.findMany({
            where : {
                adminId : userId
            }, 
            include : {
                admin : true,
            }
        });
        // console.log('rooms', rooms);
        const formatRoomData : DisplayRoomType[] = [];
        rooms.map(item => {
            const {password, id , createdAt, ...rest} = item.admin;
            const roomData = { id: item.id, slug: item.slug, createdAt: item.createdAt, updatedAt: item.updatedAt, adminId: item.adminId };
            const newData : DisplayRoomType = {...roomData, ...rest};
            formatRoomData.push(newData);
        });
        const response : APIResponse<Room[]> = {
            success : true,
            message : "Rooms fetched successfully",
            data : rooms
        }
        return res.status(200).json(response);
    } catch (error : any) {
        console.log("Error in fetching user rooms", error.message);
        const response : ErrorResponse = {
            success : false,
            message : "Internal server error"
        }
        return res.status(500).json(response);
    }

}

export async function getAllRooms(req: Request, res: Response) : Promise<any> {
    try {
        const userId = req.user?.id;
        const allRooms = await client.participants.findMany({
            where : {
                userId
            },
            select : {
                room : true,
                user : true
            }
        });
        // console.log(allRooms);
        const formatRoomData : DisplayRoomType[] = [];
        allRooms.map(item => {
            const {password, id , createdAt, ...rest} = item.user;
            const newData : DisplayRoomType = {...item.room, ...rest};
            formatRoomData.push(newData);
        });
        // console.log(formatRoomData);
        const response : APIResponse<DisplayRoomType[]> = {
            success : true,
            message : "Rooms fetched successfully",
            data : formatRoomData
        }
        return res.status(200).json(response);
    } catch (error : any) {
        console.log("Error in fetching all rooms", error.message);
        const response : ErrorResponse = {
            success : false,
            message : "Internal server error"
        }
        return res.status(500).json(response);
    }

}