-- CreateEnum
CREATE TYPE "CarStatus" AS ENUM ('DAMAGED', 'GOOD_CONDITION', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "DailyCarCondition" AS ENUM ('TIRE', 'ENGINE', 'BRAKE', 'LIGHT');

-- AlterTable
ALTER TABLE "Bus" ADD COLUMN     "CarStatus" "CarStatus" NOT NULL DEFAULT 'GOOD_CONDITION',
ADD COLUMN     "status" "EStatus" NOT NULL DEFAULT 'AVAILABLE';

-- AlterTable
ALTER TABLE "DailyActivity" ADD COLUMN     "CarStatus" "CarStatus" NOT NULL DEFAULT 'GOOD_CONDITION',
ADD COLUMN     "DailyCarCondition" "DailyCarCondition"[];
