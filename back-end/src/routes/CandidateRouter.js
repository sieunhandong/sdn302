const express = require('express')
const router = express.Router()
const candidateController = require('../controllers/CandidateController')
const { authAdminMiddleware, authMentorMiddleware } = require('../middleware/authMiddleware');

// danh sách candidate ứng tuyển của mentor
router.get("/get-candidate-info/:mentor_id", authMentorMiddleware, candidateController.getCandidatesByMentor);
// cập nhật candidate lên intern
router.put("/accept-candidate/projects/:projectId/candidates/:candidateId", authMentorMiddleware, candidateController.acceptCandidate);
// danh sách candidate ứng tuyển của 1 project
router.get("/get-candidate-by-project/:project_id", authAdminMiddleware, candidateController.getCandidatesByProjectId);

module.exports = router;

