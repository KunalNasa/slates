import { Chat } from "./ChatType"
import { Room } from "./RoomType"

export interface User{
    id : string,
    email : string,
    username : string,
    name? : string | null,
    avatar? : string | null,
    password : string,
    createdAt : Date,
    updatedAt : Date,
    rooms? : Room[],
    chat? : Chat[]

}


// model User {
//     id            String   @id @default(cuid())
//     email         String   @unique
//     username      String   @unique
//     name          String?  @default("")  
//     avatar        String?  @default("")
//     password      String
//     createdAt     DateTime @default(now())
//     updatedAt     DateTime @updatedAt
  
//     rooms         Room[]
//     chat          Chat[]
//   }