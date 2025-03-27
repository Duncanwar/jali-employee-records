/*
  Warnings:

  - Added the required column `dayOfWeek` to the `WeelkyTimeTableActivity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endOfWeek` to the `WeelkyTimeTableActivity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startOfWeek` to the `WeelkyTimeTableActivity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DailyActivity" ADD COLUMN     "endJob" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "startJob" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "WeelkyTimeTableActivity" ADD COLUMN     "dayOfWeek" TEXT NOT NULL,
ADD COLUMN     "endOfWeek" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startOfWeek" TIMESTAMP(3) NOT NULL;
