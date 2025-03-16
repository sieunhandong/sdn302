const express = require('express')
const router = express.Router()
const mentorController = require('../controllers/MentorController')
const { authAdminMiddleware } = require('../middleware/authMiddleware');

//Xem thong tin mentor, search mentor by name
router.get("/get-mentor-info", authAdminMiddleware, mentorController.getMentorInfo);
// router.get("/get-mentor-info", mentorController.getMentorInfo);

module.exports = router;

