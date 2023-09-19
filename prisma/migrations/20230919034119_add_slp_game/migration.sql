/*
  Warnings:

  - Added the required column `stage` to the `SlpGame` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startAt` to the `SlpGame` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SlpGame" ADD COLUMN     "stage" TEXT NOT NULL,
ADD COLUMN     "startAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "SlpPlayer" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "characterName" TEXT NOT NULL,
    "characterColorName" TEXT NOT NULL,

    CONSTRAINT "SlpPlayer_pkey" PRIMARY KEY ("id")
);
