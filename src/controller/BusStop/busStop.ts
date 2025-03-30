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
          buses: true, // Include user details
          subManager: true, // Include
          zone: true,
        },
      });

      return Response.send(res, 200, "Bus Stop retrieved successfully", {
        items: busStop,
        itemCount: busStop.length,
        itemsPerPage: size,
        currentPage: page,
      });
    } catch (error) {
      next(error);
    }
  }
  
  static async createBusStop(
    req: AuthenticatedRequest,
    res: ExpressResponse,
    next: NextFunction
  ): Promise<ExpressResponse | void> {
    try {
      // Fetch paginated drivers
      const { busStopName, zoneId } = req.body;
      const busStop = await prisma.busStop.create({
        data: { busStopName: busStopName, zoneId: zoneId },
      });

      return Response.send(
        res,
        200,
        "Bus Stop retrieved successfully",
        busStop
      );
    } catch (error) {
      next(error);
    }
  }
  static async updateBusStop(
    req: AuthenticatedRequest,
    res: ExpressResponse,
    next: NextFunction
  ): Promise<ExpressResponse | void> {
    try {
      // Fetch paginated drivers
      const { id } = req.params;
      const { ...data } = req.params;
      const busStop = await prisma.busStop.update({
        where: { id: Number(id) },
        data: data,
      });
      if (!busStop) return;
      return Response.send(res, 200, "Bus Stop Updated successfully", busStop);
    } catch (error) {
      next(error);
    }
  }
  static async deleteBusStop(
    req: AuthenticatedRequest,
    res: ExpressResponse,
    next: NextFunction
  ): Promise<ExpressResponse | void> {
    try {
      // Fetch paginated drivers
      const { id } = req.params;
      const busStop = await prisma.busStop.findUnique({
        where: { id: Number(id) },
      });
      if (!busStop) return;
      return Response.send(res, 200, "Bus Stop Updated successfully", busStop);
    } catch (error) {
      next(error);
    }
  }
}