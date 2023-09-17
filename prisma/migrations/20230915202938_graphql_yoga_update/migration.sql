/*
  Warnings:

  - You are about to drop the column `name` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `Set` table. All the data in the column will be lost.
  - Added the required column `startGgId` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startGgId` to the `Set` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "name",
DROP COLUMN "slug",
ADD COLUMN     "startGgId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Set" DROP COLUMN "slug",
ADD COLUMN     "startGgId" INTEGER NOT NULL;
