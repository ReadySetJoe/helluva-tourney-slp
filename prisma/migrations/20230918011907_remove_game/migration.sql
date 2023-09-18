/*
  Warnings:

  - You are about to drop the column `gameId` on the `Entrant` table. All the data in the column will be lost.
  - You are about to drop the `Game` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `setId` to the `Entrant` table without a default value. This is not possible if the table is not empty.
  - Made the column `tournamentId` on table `Event` required. This step will fail if there are existing NULL values in that column.
  - Made the column `eventId` on table `Set` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Entrant" DROP CONSTRAINT "Entrant_gameId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_tournamentId_fkey";

-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_setId_fkey";

-- DropForeignKey
ALTER TABLE "Set" DROP CONSTRAINT "Set_eventId_fkey";

-- AlterTable
ALTER TABLE "Entrant" DROP COLUMN "gameId",
ADD COLUMN     "setId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "tournamentId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Set" ALTER COLUMN "eventId" SET NOT NULL;

-- DropTable
DROP TABLE "Game";

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Set" ADD CONSTRAINT "Set_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entrant" ADD CONSTRAINT "Entrant_setId_fkey" FOREIGN KEY ("setId") REFERENCES "Set"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
