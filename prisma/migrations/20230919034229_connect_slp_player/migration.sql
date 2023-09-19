/*
  Warnings:

  - Added the required column `slpGameId` to the `SlpPlayer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SlpPlayer" ADD COLUMN     "slpGameId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "SlpPlayer" ADD CONSTRAINT "SlpPlayer_slpGameId_fkey" FOREIGN KEY ("slpGameId") REFERENCES "SlpGame"("id") ON DELETE CASCADE ON UPDATE CASCADE;
