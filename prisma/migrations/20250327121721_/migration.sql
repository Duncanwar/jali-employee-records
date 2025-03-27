/*
  Warnings:

  - You are about to drop the column `endJob` on the `DailyActivity` table. All the data in the column will be lost.
  - You are about to drop the column `startJob` on the `DailyActivity` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DailyActivity" DROP COLUMN "endJob",
DROP COLUMN "startJob";
