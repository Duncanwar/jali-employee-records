/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Driver` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Manager` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `SubManager` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[busStopId]` on the table `SubManager` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `managerId` to the `Zone` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_busStopId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_zoneId_fkey";

-- AlterTable
ALTER TABLE "SubManager" ADD COLUMN     "busStopId" INTEGER;

-- AlterTable
ALTER TABLE "Zone" ADD COLUMN     "managerId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Admin_userId_key" ON "Admin"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_userId_key" ON "Driver"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Manager_userId_key" ON "Manager"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SubManager_userId_key" ON "SubManager"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SubManager_busStopId_key" ON "SubManager"("busStopId");

-- AddForeignKey
ALTER TABLE "Zone" ADD CONSTRAINT "Zone_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "Manager"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubManager" ADD CONSTRAINT "SubManager_busStopId_fkey" FOREIGN KEY ("busStopId") REFERENCES "BusStop"("id") ON DELETE SET NULL ON UPDATE CASCADE;
