const express = require('express')
const router = express.Router()
const internController = require('../controllers/InternController')
const { authInternMiddleware, authMentorMiddleware } = require('../middleware/authMiddleware');

router.post("/create-intern", internController.createIntern);
router.post("/create-report", authInternMiddleware, internController.createReport);
// router.get("/get-interns-by-project/:project_id", authMentorMiddleware, internController.getInternsByProject);
router.get("/get-interns-by-project/:project_id", internController.getInternsByProject);

module.exports = router;

