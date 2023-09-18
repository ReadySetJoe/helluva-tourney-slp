-- DropForeignKey
ALTER TABLE "Entrant" DROP CONSTRAINT "Entrant_setId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_tournamentId_fkey";

-- DropForeignKey
ALTER TABLE "Set" DROP CONSTRAINT "Set_eventId_fkey";

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Set" ADD CONSTRAINT "Set_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entrant" ADD CONSTRAINT "Entrant_setId_fkey" FOREIGN KEY ("setId") REFERENCES "Set"("id") ON DELETE CASCADE ON UPDATE CASCADE;
