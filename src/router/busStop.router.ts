import { Router } from "express";
import BusStopController from "../controller/BusStop/busStop";

const BusStopRouter: Router = Router();

BusStopRouter.get("/get-busStop", BusStopController.getBusStop);

export default BusStopRouter;
