/*
  Warnings:

  - You are about to drop the column `startGgId` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `startGgId` on the `Set` table. All the data in the column will be lost.
  - Added the required column `ggId` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ggId` to the `Set` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "startGgId",
ADD COLUMN     "ggId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Set" DROP COLUMN "startGgId",
ADD COLUMN     "ggId" INTEGER NOT NULL;
