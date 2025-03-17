const express = require("express");
const router = express.Router();
const reportController = require("../controllers/ReportController");
const { authHRMiddleware } = require("../middleware/authMiddleware");

// Report Routes
router.get("/all-reports", reportController.getAllReports);
router.get("/:id", reportController.getReportById);
router.post("/create-report", authHRMiddleware, reportController.createReport);
router.put("/:id", authHRMiddleware, reportController.updateReport);
router.delete("/:id", authHRMiddleware, reportController.deleteReport);

module.exports = router;