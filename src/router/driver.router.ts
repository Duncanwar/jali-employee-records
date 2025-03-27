import { Router } from "express";
import DriverController from "../controller/driver/driver";

const DriverRouter: Router = Router();

DriverRouter.post("/create-driver", DriverController.registerDriver);
DriverRouter.get("/get-driver", DriverController.getDrivers);
DriverRouter.put("/update-driver", DriverController.getDrivers);

export default DriverRouter;
