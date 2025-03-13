const express = require('express')
const router = express.Router()
const mentorController = require('../controllers/MentorController')
const { authAdminMiddleware } = require('../middleware/authMiddleware');

// router.get("/get-mentor-info", authAdminMiddleware, mentorController.getMentorInfo);
router.get("/get-mentor-info", mentorController.getMentorInfo);

module.exports = router;

