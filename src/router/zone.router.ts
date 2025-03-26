import { Router } from "express";
import BusesController from "../controller/Zone/zone";

const ZoneRouter: Router = Router();

// ZoneRouter.post("/create-driver", BusesController.registerDriver);
ZoneRouter.get("/get-zone", BusesController.getZone);

export default ZoneRouter;
