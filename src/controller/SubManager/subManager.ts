import { Response as ExpressResponse, NextFunction, Request } from "express";
import { prisma } from "../../config/database";
import Response from "../../services/response";

interface AuthenticatedRequest extends Request {
  //   user?: User;
}

export default class SubManagerController {
  static async getSubManager(
    req: AuthenticatedRequest,
    res: ExpressResponse,
    next: NextFunction
  ): Promise<ExpressResponse | void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const size = parseInt(req.query.size as string) || 10;

      // Fetch paginated drivers
      const subManager = await prisma.subManager.findMany({
        // orderBy: { : "desc" },
        skip: (page - 1) * size,
        take: size,
        include: {
          // Include user details
          user: true,
        },
      });

      return Response.send(res, 200, "Drivers retrieved successfully", {
        items: subManager,
        itemCount: subManager.length,
        itemsPerPage: size,
        currentPage: page,
      });
    } catch (error) {
      next(error);
    }
  }
  // Sub-manager approves the bus arrival (at the bus station)
  static async approveArrival(req: Request, res: ExpressResponse) {
    const { id } = req.params; // The DailyActivity ID
    const { userId, busId } = req.body; // Assuming sub-manager's userId is sent in the body

    try {
      const dailyActivity = await prisma.dailyActivity.findFirst({
        where: {
          id: parseInt(id),
          busId: busId, // Ensure the activity belongs to this bus
          busArrivalTime: null, // Only update if the bus has not arrived yet
        },
      });

      if (!dailyActivity) {
        return res
          .status(404)
          .json({ error: "No ongoing activity found for the specified bus" });
      }

      // Update the arrival time and approval status
      const updatedActivity = await prisma.dailyActivity.update({
        where: { id: parseInt(id) },
        data: {
          busArrivalTime: new Date(),
        },
      });

      return res.json({ message: "Bus arrival approved", updatedActivity });
    } catch (error) {
      return res.status(500).json({ error: "Failed to approve bus arrival" });
    }
  }
}
