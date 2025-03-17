const EvaluationModel = require("../models/EvaluationModel");
const mongoose = require("mongoose");

// Get all evaluations
const getAllEvaluations = async (req, res, next) => {
    try {
        const evaluations = await EvaluationModel.find().populate("intern_id project_id mentor_id position_id");
        res.status(200).json({ status: "OK", data: evaluations });
    } catch (error) {
        next(error);
    }
};

// Get evaluation by ID
const getEvaluationById = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ status: "ERR", message: "Invalid ID" });
        }
        const evaluation = await EvaluationModel.findById(id).populate("intern_id project_id mentor_id position_id");
        if (!evaluation) return res.status(404).json({ status: "ERR", message: "Evaluation not found" });
        res.status(200).json({ status: "OK", data: evaluation });
    } catch (error) {
        next(error);
    }
};

// Create new evaluation
const createEvaluation = async (req, res, next) => {
    try {
        const evaluation = new EvaluationModel(req.body);
        await evaluation.save();
        res.status(201).json({ status: "OK", data: evaluation });
    } catch (error) {
        next(error);
    }
};

// Update evaluation
const updateEvaluation = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ status: "ERR", message: "Invalid ID" });
        }
        const evaluation = await EvaluationModel.findByIdAndUpdate(id, req.body, { new: true });
        if (!evaluation) return res.status(404).json({ status: "ERR", message: "Evaluation not found" });
        res.status(200).json({ status: "OK", data: evaluation });
    } catch (error) {
        next(error);
    }
};

// Delete evaluation
const deleteEvaluation = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ status: "ERR", message: "Invalid ID" });
        }
        const evaluation = await EvaluationModel.findByIdAndDelete(id);
        if (!evaluation) return res.status(404).json({ status: "ERR", message: "Evaluation not found" });
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};


module.exports = {
    getAllEvaluations,
    getEvaluationById,
    createEvaluation,
    updateEvaluation,
    deleteEvaluation,
};
