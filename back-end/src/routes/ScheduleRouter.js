const express = require("express");
const router = express.Router();
const ScheduleController = require("../controllers/ScheduleController");
const {
  authMentorMiddleware,
  authHRMiddleware,
} = require("../middleware/authMiddleware");

router.post(
  "/create-schedule",
  authHRMiddleware,
  ScheduleController.createShedule
);
router.patch(
  "/delete-schedule/:id",
  authHRMiddleware,
  ScheduleController.deleteSchedule
);
router.get(
  "/list-schedule",
  authHRMiddleware,
  ScheduleController.getAllSchedules
);

router.get(
  "/view-schedule/:mentor_id",
  authMentorMiddleware,
  ScheduleController.getScheduleByMentorId
);
router.put(
  "/update-schedule/:id",
  authHRMiddleware,
  ScheduleController.updateSchedule
);
module.exports = router;
