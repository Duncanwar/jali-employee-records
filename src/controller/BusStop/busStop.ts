import { Response as ExpressResponse, NextFunction, Request } from "express";
import { prisma } from "../../config/database";
import Response from "../../services/response";

interface AuthenticatedRequest extends Request {
  //   user?: User;
}

export default class BusStopController {
  static async getBusStop(
    req: AuthenticatedRequest,
    res: ExpressResponse,
    next: NextFunction
  ): Promise<ExpressResponse | void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const size = parseInt(req.query.size as string) || 10;

      // Fetch paginated drivers
      const busStop = await prisma.busStop.findMany({
        // orderBy: { : "desc" },
        skip: (page - 1) * size,
        take: size,
        include: {
          Bus: true, // Include user details
          User: true, // Include
          zone: true,
        },
      });

      return Response.send(res, 200, "Drivers retrieved successfully", {
        items: busStop,
        itemCount: busStop.length,
        itemsPerPage: size,
        currentPage: page,
      });
    } catch (error) {
      next(error);
    }
  }
}
