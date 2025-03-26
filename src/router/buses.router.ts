import { Router } from "express";
import ZoneController from "../controller/Zone/zone";

const ZoneRouter: Router = Router();

// ZoneRouter.post("/create-driver", ZoneController.registerDriver);
ZoneRouter.get("/get-zone", ZoneController.getZone);

export default ZoneRouter;
