const express = require('express')
const router = express.Router()
const candidateController = require('../controllers/CandidateController')
const { authAdminMiddleware } = require('../middleware/authMiddleware');

router.get("/get-candidate-info/:mentor_id", candidateController.getCandidatesByMentor);

module.exports = router;

