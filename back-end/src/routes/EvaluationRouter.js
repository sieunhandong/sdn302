const express = require("express");
const router = express.Router();
const {
    getAllEvaluations,
    getEvaluationById,
    createEvaluation,
    updateEvaluation,
    deleteEvaluation,
    searchEvaluations,
} = require("../controllers/EvaluationController");
const { authMentorMiddleware } = require("../middleware/authMiddleware");


router.get("/", getAllEvaluations);


router.get("/search", searchEvaluations);

router.post("/", createEvaluation);

router.put("/:id", updateEvaluation);

router.delete("/:id", deleteEvaluation);


module.exports = router;