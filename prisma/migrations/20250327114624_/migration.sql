/*
  Warnings:

  - You are about to drop the column `hasLeave` on the `WeelkyTimeTableActivity` table. All the data in the column will be lost.
  - You are about to drop the column `leaveDate` on the `WeelkyTimeTableActivity` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DailyActivity" ADD COLUMN     "busArrivalTime" TIMESTAMP(3),
ADD COLUMN     "carWashEndTime" TIMESTAMP(3),
ADD COLUMN     "carWashStartTime" TIMESTAMP(3),
ALTER COLUMN "endJob" DROP NOT NULL,
ALTER COLUMN "endJob" DROP DEFAULT;

-- AlterTable
ALTER TABLE "WeelkyTimeTableActivity" DROP COLUMN "hasLeave",
DROP COLUMN "leaveDate";
