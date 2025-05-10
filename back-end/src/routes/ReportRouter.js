const express = require("express");
const router = express.Router();
const reportController = require("../controllers/ReportController");
const { authMentorMiddleware } = require("../middleware/authMiddleware");

// Report Routes
router.get("/all-reports", reportController.getAllReports);
router.get("/:id",authMentorMiddleware, reportController.getReportById);
router.post("/create-report", authMentorMiddleware, reportController.createReport);
router.put("/:id", authMentorMiddleware, reportController.updateReport);
router.delete("/:id", authMentorMiddleware, reportController.deleteReport);

module.exports = router;