/*
  Warnings:

  - Added the required column `ggId` to the `Entrant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Entrant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ggId` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Entrant" ADD COLUMN     "ggId" INTEGER NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "ggId" INTEGER NOT NULL;
