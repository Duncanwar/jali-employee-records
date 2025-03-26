import { Response as ExpressResponse, NextFunction, Request } from "express";
import { prisma } from "../../config/database";
import Response from "../../services/response";

interface AuthenticatedRequest extends Request {
  //   user?: User;
}

export default class ZoneController {
  static async getZone(
    req: AuthenticatedRequest,
    res: ExpressResponse,
    next: NextFunction
  ): Promise<ExpressResponse | void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const size = parseInt(req.query.size as string) || 10;

      // Fetch paginated drivers
      const zone = await prisma.zone.findMany({
        // orderBy: { : "desc" },
        skip: (page - 1) * size,
        take: size,
        include: {
          Bus: true, // Include user details
          User: true, // Include
          BusStop: true, // Include
        },
      });

      return Response.send(res, 200, "Drivers retrieved successfully", {
        items: zone,
        itemCount: zone.length,
        itemsPerPage: size,
        currentPage: page,
      });
    } catch (error) {
      next(error);
    }
  }
}
