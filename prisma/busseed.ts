import { EStatus, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // First, find an existing manager
  const manager = await prisma.manager.findFirst();
  if (!manager) {
    throw new Error("No managers found! Please run seed.ts first.");
  }

  const createzone = await prisma.zone.create({
    data: {
      zoneName: "Corridor E",
      destination: "Kimironko",
      managerId: manager.id,  // Added the required managerId
    },
  });
  
  await prisma.busStop.createMany({
    data: [
      {
        busStopName: "Kinyinya Bus Terminal",
        zoneId: createzone.id,
      },
      { busStopName: "Batsinda Bus Terminal", zoneId: createzone.id },
      { busStopName: "Nyabugogo Bus Terminal", zoneId: createzone.id },
    ],
  });

  const busStop = await prisma.busStop.findFirst();

  if (!busStop) {
    throw new Error("No bus stops found! Please seed bus stops first.");
  }

  // await prisma.bus.createMany({
  //   data: [
  //     { plateNo: "RAC 239 W", zoneId: createzone.id, busStopId: busStop?.id, status: EStatus },
  //     { plateNo: "RAD 500 Q", zoneId: createzone.id, busStopId: busStop?.id },
  //     { plateNo: "RAA 801 L", zoneId: createzone.id, busStopId: busStop?.id },

  //     { plateNo: "RAB 600 Q", zoneId: createzone.id, busStopId: busStop?.id },

  //     { plateNo: "RAE 790 M", zoneId: createzone.id, busStopId: busStop?.id },
  //     { plateNo: "RAD 399 K", zoneId: createzone.id, busStopId: busStop?.id },
  //   ],
  // });
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });