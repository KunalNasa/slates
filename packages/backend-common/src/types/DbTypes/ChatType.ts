
export interface Chat {
    id : Number,
    message : string,
    userId : string,
    roomId : Number,
    createdAt : Date,
    updatedAt : Date,
}


// model Chat {
//     id        Int       @id @default(autoincrement())
//     message   String
//     userId    String
//     roomId    Int
//     user      User      @relation(fields: [userId], references: [id])
//     room      Room      @relation(fields: [roomId], references: [id])
//     createdAt DateTime  @default(now())
//     updatedAt DateTime  @updatedAt
//   }