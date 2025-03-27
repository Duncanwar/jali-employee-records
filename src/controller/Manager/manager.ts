import { Response as ExpressResponse, NextFunction, Request } from "express";
import { prisma } from "../../config/database";
import Response from "../../services/response";

interface AuthenticatedRequest extends Request {
  //   user?: User;
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

  // Manager starts the car wash (create new activity when bus leaves car wash)
  static async startCarWash(req: Request, res: ExpressResponse) {
    const { busId, driverId } = req.body; // busId, description, and userId (Manager)

    try {
      // Create a new DailyActivity for the bus when it leaves the car wash
      const newActivity = await prisma.dailyActivity.create({
        data: {
          busId,
          driverId,
          carWashStartTime: new Date(), // Record the time bus leaves the car wash
        },
      });

      return res.json({ message: "Bus activity started", newActivity });
    } catch (error) {
      return res.status(500).json({ error: "Failed to start bus activity" });
    }
  }
  // Manager ends the day (bus goes back to car wash)
  static async endCarWash(req: Request, res: ExpressResponse) {
    const { id } = req.params; // The DailyActivity ID
    const { userId, busId, description } = req.body; // Assuming manager's userId is sent in the body

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
}
