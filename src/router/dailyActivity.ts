import express from "express";
import ManagerController from "../controller/Manager/manager";
import SubManagerController from "../controller/SubManager/subManager";

const router = express.Router();

// Manager clicks to start the car wash (create new activity when bus leaves car wash)

router.get("/get-manager", ManagerController.getManager);

// Sub-manager approves bus arrival
router.post("/:id/approve-arrival", SubManagerController.approveArrival);

// Manager clicks to end the car wash (end of day)

export default router;
