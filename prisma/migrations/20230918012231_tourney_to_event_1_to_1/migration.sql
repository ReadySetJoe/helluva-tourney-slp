/*
  Warnings:

  - A unique constraint covering the columns `[tournamentId]` on the table `Event` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Event_tournamentId_key" ON "Event"("tournamentId");
