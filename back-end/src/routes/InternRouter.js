const express = require('express')
const router = express.Router()
const internController = require('../controllers/InternController')
const { authInternMiddleware, authMentorMiddleware, authHRMiddleware } = require('../middleware/authMiddleware');

router.post("/create-intern", authHRMiddleware, internController.createIntern);
router.post("/create-report", authInternMiddleware, internController.createReport);
// Get list interns by project id
router.get("/get-interns-by-project/:project_id", authMentorMiddleware, internController.getInternsByProject);
// router.get("/get-interns-by-project/:project_id", internController.getInternsByProject);

module.exports = router;

