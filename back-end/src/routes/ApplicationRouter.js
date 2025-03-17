const express = require("express");
const router = express.Router();

const { authUserMiddleware } = require("../middleware/authMiddleware");
const ApplicationController = require("../controllers/ApplicationController");
// candidate apply for project
router.post("/apply-project",authUserMiddleware, ApplicationController.applyForProject);





module.exports = router;