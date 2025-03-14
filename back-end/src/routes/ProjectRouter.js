const express = require('express')
const router = express.Router();
const projectController = require("../controllers/ProjectController");
const { authHRMiddleware } = require('../middleware/authMiddleware');

router.post("/create-project", authHRMiddleware, projectController.createProject);
router.get("/list-all-projects", projectController.listAllProjects);
router.get("/list-project-detail/:id", projectController.listProjectDetail);
router.patch("/change-status-project/:id", authHRMiddleware, projectController.deleteProject);
router.put("/update-project/:id", authHRMiddleware, projectController.updateProject);
module.exports = router;