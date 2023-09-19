/*
  Warnings:

  - You are about to drop the column `startAt` on the `Set` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Set" DROP COLUMN "startAt",
ADD COLUMN     "completedAt" TIMESTAMP(3);
