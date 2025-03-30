import { Driver, ERole, EStatus, Prisma, User } from "@prisma/client";
import { Response as ExpressResponse, NextFunction, Request } from "express";
import { prisma } from "../../config/database";
import Response from "../../services/response";
import { ForbiddenException } from "../../utils/exception";
import { paginate } from "../../utils/pagination";
import { CreateUserDTO } from "./dto";

interface AuthenticatedRequest extends Request {
  user?: User;
}

export default class DriverController {
  static async registerDriver(
    req: AuthenticatedRequest,
    res: ExpressResponse,
    next: NextFunction
  ): Promise<ExpressResponse | void> {
    try {
      const userDTO = req.body;

      // Ensure role is defined
      if (!userDTO.role) {
        return Response.send(res, 400, "Role is required");
      }

      // Create the user
      const user: User = await prisma.user.create({
        data: userDTO,
      });

      // If the user is a driver, create the driver entry
      if (user.role === ERole.DRIVER) {
        const driver = await prisma.driver.create({
          data: {
            userId: user.id,
            status: EStatus.NOT_AVAILABLE,
          },
        });

        return Response.send(res, 201, "User created", { user, driver });
      }

      return Response.send(res, 201, "User created", { user });
    } catch (error) {
      next(error);
    }
  }

  static async getDrivers(
    req: AuthenticatedRequest,
    res: ExpressResponse,
    next: NextFunction
  ): Promise<ExpressResponse | void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const size = parseInt(req.query.size as string) || 10;

      // Fetch paginated drivers
      const drivers = await prisma.driver.findMany({
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * size,
        take: size,
        include: {
          user: true,

          // Include user details
        },
      });

      return Response.send(res, 200, "Drivers retrieved successfully", {
        items: drivers,
        itemCount: drivers.length,
        itemsPerPage: size,
        currentPage: page,
      });
    } catch (error) {
      next(error);
    }
  }
  static async dayOffByUser(
    req: AuthenticatedRequest,
    res: ExpressResponse,
    next: NextFunction
  ): Promise<ExpressResponse | void> {
    console.log(req.user);
    const dayoff: any = await prisma.leaveSchedule.findFirst({
      where: { driverId: req.user?.id },
    });
    return Response.send(res, 200, "your day off", dayoff);
  }

  static async dayOffInWeek(
    req: AuthenticatedRequest,
    res: ExpressResponse,
    next: NextFunction
  ): Promise<ExpressResponse | void> {
    const dayoff: any = await prisma.leaveSchedule.findMany({
      include: { driver: true },
    });
    return Response.send(res, 200, "your day off", dayoff);
  }

  static async deleteDriver(
    req: AuthenticatedRequest,
    res: ExpressResponse,
    next: NextFunction
  ): Promise<ExpressResponse | void> {
    const { id } = req.params;
    const driver = await prisma.driver.delete({ where: { id: Number(id) } });
    return Response.send(res, 200, "delete a driver successfully");
  }
}
