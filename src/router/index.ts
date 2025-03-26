import { Router } from "express";
import { authenticate } from "../middleware/authHandler";
import ErrorHandler from "../middleware/errorHandler";
import AuthRouter from "./auth.router";
import DriverRoute from "./driver.router";
import orderRouter from "./order.route";
import isAdmin from "../middleware/isAdmin";

const router: Router = Router();

router.use("/auth", ErrorHandler.watch(AuthRouter));
router.use("/driver", [authenticate, isAdmin], ErrorHandler.watch(DriverRoute));
// router.use("/order", authenticate, ErrorHandler.watch(orderRouter));

router.all("/*", ErrorHandler.notFound);

export default router;
