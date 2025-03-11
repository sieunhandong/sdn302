const express = require('express')
const router = express.Router();
const projectController = require("../controllers/ProjectController");
const { authHRMiddleware } = require('../middleware/authMiddleware');
const { authAdminMiddleware } = require('../middleware/authMiddleware');

router.post("/create-project", authHRMiddleware, projectController.createProject);
router.get("/list-all-projects", projectController.listAllProjects);
router.get("/list-project-detail/:id", projectController.listProjectDetail);
router.get("/search-project-by-name/:name", projectController.searchProjectByName);
router.put("/update-project/:id", authAdminMiddleware, projectController.updateProject);
router.delete("/delete-project/:id", authAdminMiddleware, projectController.deleteProject);

module.exports = router;