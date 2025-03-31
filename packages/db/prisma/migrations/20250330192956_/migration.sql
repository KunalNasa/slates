/*
  Warnings:

  - You are about to drop the `_ParticipantsToRoom` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,roomId]` on the table `Participants` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `roomId` to the `Participants` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_ParticipantsToRoom" DROP CONSTRAINT "_ParticipantsToRoom_A_fkey";

-- DropForeignKey
ALTER TABLE "_ParticipantsToRoom" DROP CONSTRAINT "_ParticipantsToRoom_B_fkey";

-- AlterTable
ALTER TABLE "Participants" ADD COLUMN     "roomId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_ParticipantsToRoom";

-- CreateIndex
CREATE UNIQUE INDEX "Participants_userId_roomId_key" ON "Participants"("userId", "roomId");

-- AddForeignKey
ALTER TABLE "Participants" ADD CONSTRAINT "Participants_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
