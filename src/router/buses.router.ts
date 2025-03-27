import { Router } from "express";
import BusesController from "../controller/Buses/buses";

const BusesRouter: Router = Router();

// BusesRouter.post("/create-driver", BusesController.registerDriver);
BusesRouter.get("/get-buses", BusesController.getBuses);

export default BusesRouter;
