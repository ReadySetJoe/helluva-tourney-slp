-- CreateTable
CREATE TABLE "SlpGame" (
    "id" SERIAL NOT NULL,
    "fileName" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "tournamentId" INTEGER NOT NULL,
    "setId" INTEGER,
    "userId" TEXT NOT NULL,

    CONSTRAINT "SlpGame_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SlpGame" ADD CONSTRAINT "SlpGame_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SlpGame" ADD CONSTRAINT "SlpGame_setId_fkey" FOREIGN KEY ("setId") REFERENCES "Set"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SlpGame" ADD CONSTRAINT "SlpGame_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
