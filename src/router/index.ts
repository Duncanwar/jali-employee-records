import { Router } from "express";
import { authenticate } from "../middleware/authHandler";
import ErrorHandler from "../middleware/errorHandler";
import AuthRouter from "./auth.router";
import DriverRoute from "./driver.router";
import BusesRoute from "./buses.router";
import BusStopRoute from "./busStop.router";
import isAdmin from "../middleware/isAdmin";

const router: Router = Router();

router.use("/auth", ErrorHandler.watch(AuthRouter));
router.use("/driver", [authenticate, isAdmin], ErrorHandler.watch(DriverRoute));
router.use("/buses", authenticate, ErrorHandler.watch(BusesRoute));
router.use("/busStop", authenticate, ErrorHandler.watch(BusStopRoute));

router.all("/*", ErrorHandler.notFound);

export default router;
