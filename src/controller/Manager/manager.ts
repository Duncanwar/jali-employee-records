import { Response as ExpressResponse, NextFunction, Request } from "express";
import { prisma } from "../../config/database";
import Response from "../../services/response";
import { User } from "@prisma/client";

interface AuthenticatedRequest extends Request {
  user?: User;
}

export default class ManagerController {
  static async getManager(
    req: AuthenticatedRequest,
    res: ExpressResponse,
    next: NextFunction
  ): Promise<ExpressResponse | void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const size = parseInt(req.query.size as string) || 10;

      // Fetch paginated drivers
      const manager = await prisma.manager.findMany({
        // orderBy: { : "desc" },
        skip: (page - 1) * size,
        take: size,
        include: {
          // Include user details
          user: true,
        },
      });

      return Response.send(res, 200, "Drivers retrieved successfully", {
        items: manager,
        itemCount: manager.length,
        itemsPerPage: size,
        currentPage: page,
      });
    } catch (error) {
      next(error);
    }
  }

  static async startCarWash(req: Request, res: ExpressResponse) {
    const { buses } = req.body;
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
    console.log(buses);
    for (const bus in buses) {
      try {
        const busInActivity = await prisma.dailyActivity.findFirst({
          where: { busId: Number(bus) },
        });
        if (busInActivity) {
          return Response.send(res, 400, "Bus in today activity");
        }
        const todayTimetable = await prisma.weelkyTimeTableActivity.findMany({
          where: { dayOfWeek: today, busId: Number(bus) },
          include: { bus: true, driver: true },
        });

        const newActivity = await prisma.dailyActivity.create({
          data: {
            busId: Number(bus),
            driverId: todayTimetable[0].driver.id,
            carWashStartTime: new Date(),
          },
        });
        return res.json({ message: "Bus activity started", newActivity });
      } catch (error) {
        console.error(error);
      }
    }
    return res.status(500).json({ error: "Failed to start bus activity" });
  }

  static async endCarWash(req: Request, res: ExpressResponse) {
    const { id } = req.params;
    const { busId, description } = req.body; // Assuming manager's userId is sent in the body

    try {
      const dailyActivity = await prisma.dailyActivity.findFirst({
        where: {
          id: parseInt(id),

          busId: busId, // Ensure the activity belongs to this bus
          carWashEndTime: null, // Only update if the bus has not returned to the car wash yet
        },
      });

      if (!dailyActivity) {
        return res
          .status(404)
          .json({ error: "No ongoing activity found for the specified bus" });
      }

      // Update the end time of the car wash
      const updatedActivity = await prisma.dailyActivity.update({
        where: { id: parseInt(id) },
        data: {
          description: description,
          carWashEndTime: new Date(),
        },
      });

      return res.json({
        message: "Car wash end time recorded",
        updatedActivity,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Failed to update car wash end time" });
    }
  }
  static async getDailyActivity(req: Request, res: ExpressResponse) {
    const page = parseInt(req.query.page as string) || 1;
    const size = parseInt(req.query.size as string) || 10;
    const activity = await prisma.dailyActivity.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * size,
      take: size,
      include: { bus: true, driver: true },
    });
    return Response.send(res, 200, "DailyActivities retrieved successfully", {
      items: activity,
      itemCount: activity.length,
      itemsPerPage: size,
      currentPage: page,
    });
  }
}
