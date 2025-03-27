import { Router } from "express";
import { generateWeeklyTimetable } from "../controller/WeeklyTimetable/weeklyTimetable";

const weelkyTimeTableRouter: Router = Router();

weelkyTimeTableRouter.get("/assign-drivers", generateWeeklyTimetable);
// weelkyTimeTableRouter.get("/run-driver", runAssignment);
// weelkyTimeTableRouter.get("/get-driver", getAvailableDrivers);

export default weelkyTimeTableRouter;
