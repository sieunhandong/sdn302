const express = require('express')
const router = express.Router()
const internController = require('../controllers/InternController')
const { authInternMiddleware } = require('../middleware/authMiddleware');

router.post("/create-intern", internController.createIntern);
router.post("/create-report", authInternMiddleware, internController.createReport);

module.exports = router;

