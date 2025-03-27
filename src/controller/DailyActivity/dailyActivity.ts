import { prisma } from "../../config/database";
import { Response as ExpressResponse, NextFunction, Request } from "express";

async function updateBusActivity(
  busId: number,
  action: string,
  userId: number
) {
  // Find the relevant DailyActivity entry for today and the specific bus
  const dailyActivity = await prisma.dailyActivity.findFirst({
    where: {
      busId,
      driverId: userId, // Assuming driverId maps to the user taking action
    },
  });

  if (!dailyActivity) {
    throw new Error("No ongoing activity found for the specified bus");
  }

  let updateData = {};
  const now = new Date();

  switch (action) {
    case "startCarWash":
      // Manager starts the day by marking the bus is out of the car wash
      updateData = { carWashStartTime: now };
      break;

    case "approveArrival":
      // Sub-manager approves bus arrival at the station
      updateData = { busArrivalTime: now, approvedBySubManager: true };
      break;

    case "endCarWash":
      // Manager ends the day by marking the bus is at the car wash
      updateData = { carWashEndTime: now };
      break;

    default:
      throw new Error("Invalid action");
  }

  // Update the DailyActivity record with the new times or status
  await prisma.dailyActivity.update({
    where: { id: dailyActivity.id },
    data: updateData,
  });

  return `Successfully updated activity for bus ${busId}`;
}
export function dailyActivity(req: Request, res: Response, next: NextFunction) {
  console.log(req.body);
  // const {busId, action, userId} =  req.body
  //  updateBusActivity(busId, action, userId)
}
