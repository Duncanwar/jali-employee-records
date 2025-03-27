import cron from "node-cron";
import { prisma } from "../../config/database";
import { Response as ExpressResponse, Request, NextFunction } from "express";
import Response from "../../services/response";

export async function generateWeeklyTimetable() {
  const today = new Date();
  const dayIndex = today.getDay();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - dayIndex + (dayIndex === 0 ? -6 : 1)); // Get Monday
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // Get Sunday

  const buses = await prisma.bus.findMany();
  const drivers = await prisma.driver.findMany({ include: { user: true } });

  if (buses.length === 0 || drivers.length < 7) {
    console.error("❌ Not enough buses or drivers to proceed.");
    return;
  }

  const sortedDrivers = [...drivers].sort((a, b) => a.id - b.id);
  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // Assign unique leave days to drivers
  const driverLeaveMap = new Map();
  for (const driver of sortedDrivers) {
    let leaveDay;
    do {
      leaveDay = weekDays[Math.floor(Math.random() * weekDays.length)];
    } while (driverLeaveMap.has(leaveDay)); // Ensure uniqueness
    driverLeaveMap.set(driver.userId, leaveDay);

    const leaveDate = new Date(startOfWeek);
    leaveDate.setDate(startOfWeek.getDate() + weekDays.indexOf(leaveDay));

    await prisma.leaveSchedule.upsert({
      where: { driverId_startOfWeek: { driverId: driver.userId, startOfWeek } },
      update: { leaveDate },
      create: { driverId: driver.userId, startOfWeek, endOfWeek, leaveDate },
    });
  }

  const assignments = [];

  for (let i = 0; i < 7; i++) {
    const dayOfWeek = weekDays[i];
    const assignedDrivers = new Set(); // Track assigned drivers for this day
    let availableDrivers = [...sortedDrivers];

    for (const bus of buses) {
      // Filter drivers who are available and not on leave
      const validDrivers = availableDrivers.filter(
        (d) =>
          driverLeaveMap.get(d.userId) !== dayOfWeek &&
          !assignedDrivers.has(d.userId)
      );

      if (validDrivers.length === 0) continue; // No available driver for this bus

      const driver = validDrivers.shift(); // Pick the first available driver
      assignedDrivers.add(driver?.userId); // Mark driver as assigned
      availableDrivers = availableDrivers.filter(
        (d) => d.userId !== driver?.userId
      ); // Remove from pool

      assignments.push({
        busId: bus.id,
        driverId: driver?.userId ?? 0,
        startOfWeek,
        endOfWeek,
        dayOfWeek,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  }

  await prisma.weelkyTimeTableActivity.createMany({ data: assignments });

  console.log(
    `✅ Weekly timetable generated from ${startOfWeek.toDateString()} to ${endOfWeek.toDateString()}`
  );
}

export async function getWeeklyTimetable(
  req: Request,
  res: ExpressResponse,
  next: NextFunction
): Promise<ExpressResponse | void> {
  const timetable = await prisma.weelkyTimeTableActivity.findMany({
    include: { bus: true, driver: true },
  });
  return Response.send(res, 201, "Timetable displayed", timetable);
}
export async function getDailyTimetable(
  req: Request,
  res: ExpressResponse,
  next: NextFunction
): Promise<ExpressResponse | void> {
  // const { dayOfWeek } = req.params;
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const today = daysOfWeek[new Date().getDay()];
  console.log(today);
  const timetable = await prisma.weelkyTimeTableActivity.findMany({
    where: { dayOfWeek: today },
    include: {
      bus: true,
      driver: true,
    },
  });
  return Response.send(res, 201, "Timetable for Today", timetable);
}
