const express = require('express')
const router = express.Router()
const candidateController = require('../controllers/CandidateController')
const { authAdminMiddleware } = require('../middleware/authMiddleware');

router.get("/get-candidate-info/:mentor_id", candidateController.getCandidatesByMentor);
router.put("/accept-candidate/projects/:projectId/candidates/:candidateId", candidateController.acceptCandidate);
router.get("/get-candidate-by-project/:project_id", candidateController.getCandidatesByProjectId);

module.exports = router;

