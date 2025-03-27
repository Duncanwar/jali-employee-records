-- CreateTable
CREATE TABLE "LeaveSchedule" (
    "id" SERIAL NOT NULL,
    "driverId" INTEGER NOT NULL,
    "startOfWeek" TIMESTAMP(3) NOT NULL,
    "endOfWeek" TIMESTAMP(3) NOT NULL,
    "leaveDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeaveSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LeaveSchedule_driverId_startOfWeek_key" ON "LeaveSchedule"("driverId", "startOfWeek");

-- AddForeignKey
ALTER TABLE "LeaveSchedule" ADD CONSTRAINT "LeaveSchedule_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
