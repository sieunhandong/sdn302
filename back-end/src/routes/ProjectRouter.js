const express = require('express')
const router = express.Router();
const projectController = require("../controllers/ProjectController");
const { authHRMiddleware } = require('../middleware/authMiddleware');

router.post("/create-project", authHRMiddleware, projectController.createProject);

module.exports = router;