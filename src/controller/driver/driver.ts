import { ERole, EStatus, User } from "@prisma/client";
import { Response as ExpressResponse, NextFunction, Request } from "express";
import { prisma } from "../../config/database";
import Response from "../../services/response";

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

      if (user.role === ERole.DRIVER) {
        const driver = await prisma.driver.create({
          data: {
            userId: user.id,
            status: EStatus.AVAILABLE,
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
      include: { driver: true },
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
    return Response.send(res, 200, "All workers day off in a week", dayoff);
  }

  static async updateDriver(
    req: AuthenticatedRequest,
    res: ExpressResponse,
    next: NextFunction
  ): Promise<ExpressResponse | void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Find the driver to get the userId
      const driver = await prisma.driver.findUnique({
        where: { id: Number(id) },
      });

      if (!driver) {
        return Response.send(res, 404, "Driver not found");
      }

      // Update the driver status if provided
      if (updateData.status) {
        await prisma.driver.update({
          where: { id: Number(id) },
          data: { status: updateData.status },
        });
      }

      // Update the user information if provided
      if (
        updateData.fullName ||
        updateData.email ||
        updateData.isActive !== undefined
      ) {
        const userData: any = {};
        if (updateData.fullName) userData.fullName = updateData.fullName;
        if (updateData.email) userData.email = updateData.email;
        if (updateData.isActive !== undefined)
          userData.isActive = updateData.isActive;

        await prisma.user.update({
          where: { id: driver.userId },
          data: userData,
        });
      }

      const updatedDriver = await prisma.driver.findUnique({
        where: { id: Number(id) },
        include: { user: true },
      });

      return Response.send(
        res,
        200,
        "Driver updated successfully",
        updatedDriver ?? {}
      );
    } catch (error) {
      next(error);
    }
  }

  static async deleteDriver(
    req: AuthenticatedRequest,
    res: ExpressResponse,
    next: NextFunction
  ): Promise<ExpressResponse | void> {
    const { id } = req.params;
    const driver = await prisma.driver.delete({ where: { id: Number(id) } });
    return Response.send(res, 200, "delete a driver successfully", driver);
  }
}
