/*
  Warnings:

  - Added the required column `roundText` to the `Set` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `round` on the `Set` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Set" ADD COLUMN     "roundText" TEXT NOT NULL,
DROP COLUMN "round",
ADD COLUMN     "round" INTEGER NOT NULL;
