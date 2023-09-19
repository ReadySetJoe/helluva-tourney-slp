-- AlterTable
ALTER TABLE "Set" ADD COLUMN     "startAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "SlpGame" ALTER COLUMN "stage" DROP DEFAULT;
