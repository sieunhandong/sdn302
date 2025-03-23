const express = require("express");
const router = express.Router();
const recruitmentController = require("../controllers/RecruitmentController");
const { authMentorMiddleware, authHRMiddleware } = require("../middleware/authMiddleware");

router.post("/create-recruitment", authMentorMiddleware, recruitmentController.createRecruitment);
router.put("/update-recruitment/:id", authMentorMiddleware, recruitmentController.updateRecruitment);
router.delete("/delete-recruitment/:id", authMentorMiddleware, recruitmentController.deleteRecruitment);
router.get("/get-all-recruitment", authHRMiddleware, recruitmentController.getAllRecruitments);
router.get("/get-all-recruitment-by-mentor/:id", authMentorMiddleware, recruitmentController.getAllRecruitmentsByMentorId);




module.exports = router;
