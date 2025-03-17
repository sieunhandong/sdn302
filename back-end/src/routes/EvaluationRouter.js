const express = require("express");
const router = express.Router();
const evaluationController = require("../controllers/EvaluationController");
const { authHRMiddleware } = require("../middleware/authMiddleware");


router.get("/evaluations", evaluationController.getAllEvaluations);
router.get("/evaluations/:id", evaluationController.getEvaluationById);
router.post("/evaluations", authHRMiddleware, evaluationController.createEvaluation);
router.put("/evaluations/:id", authHRMiddleware, evaluationController.updateEvaluation);
router.delete("/evaluations/:id", authHRMiddleware, evaluationController.deleteEvaluation);


module.exports = router;