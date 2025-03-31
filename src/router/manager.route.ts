import express from "express";
import ManagerController from "../controller/Manager/manager";
import SubManagerController from "../controller/SubManager/subManager";

const router = express.Router();

// Manager clicks to start the car wash (create new activity when bus leaves car wash)
router.post(
  "/daily-activity/start-car-wash",

  ManagerController.startCarWash
);
router.get("/get-manager", ManagerController.getManager);
// Sub-manager approves bus arrival

// Manager clicks to end the car wash (end of day)
router.post("/daily-activity/:id/end-car-wash", ManagerController.endCarWash);

export default router;
