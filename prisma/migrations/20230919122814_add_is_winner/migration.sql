/*
  Warnings:

  - Added the required column `isWinner` to the `SlpPlayer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SlpPlayer" ADD COLUMN     "isWinner" BOOLEAN NOT NULL;
