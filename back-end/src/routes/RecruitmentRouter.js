const express = require("express");
const router = express.Router();
const recruitmentController = require("../controllers/RecruitmentController");
const { authMentorMiddleware } = require("../middleware/authMiddleware");

router.post("/create-recruitment", authMentorMiddleware, recruitmentController.createRecruitment);




module.exports = router;
