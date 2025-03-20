import { Chat } from "./ChatType"

export interface Room {
  id : string,
  slug : string,
  createdAt : Date,
  updatedAt : Date,
  adminId : string,
  chat? : Chat[]
}


// model Room {
//     id        Int       @id @default(autoincrement())
//     slug      String    @unique
//     createdAt DateTime  @default(now())
//     updatedAt DateTime  @updatedAt
//     admindId  String
//     admin     User      @relation(fields: [admindId], references: [id])
  
//     chat      Chat[]
//   }