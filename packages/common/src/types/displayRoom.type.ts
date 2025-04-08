export interface DisplayRoomType { 
    id : number,
    slug : string,
    createdAt: Date,
    updatedAt : Date,
    adminId : string,
    email : string,
    username : string,
    name : string | null,
    avatar : string | null
}