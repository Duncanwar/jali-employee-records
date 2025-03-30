import { Router } from "express";
import BusesController from "../controller/Buses/buses";

const BusesRouter: Router = Router();

BusesRouter.get("/get-buses", BusesController.getBuses);
BusesRouter.post("/create-buses", BusesController.createBus);
BusesRouter.put("/update-buses", BusesController.getBuses);
BusesRouter.delete("/delete-buses", BusesController.getBuses);

export default BusesRouter;
