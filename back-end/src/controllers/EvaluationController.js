const Evaluation = require("../models/EvaluationModel");
const mongoose = require("mongoose");

// Lấy tất cả evaluations
const getAllEvaluations = async (req, res, next) => {
    try {
        const evaluations = await Evaluation.find().populate("intern_id project_id mentor_id position_id");
        res.status(200).json({ status: "OK", data: evaluations });
    } catch (error) {
        next(error);
    }
};

// Lấy Evaluation theo ID
const getEvaluationById = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ status: "ERR", message: "Invalid ID" });
        }
        const evaluation = await Evaluation.findById(id).populate("intern_id project_id mentor_id position_id");
        if (!evaluation) return res.status(404).json({ status: "ERR", message: "Evaluation not found" });
        res.status(200).json({ status: "OK", data: evaluation });
    } catch (error) {
        next(error);
    }
};

// Tạo mới Evaluation
const createEvaluation = async (req, res, next) => {
    try {
        const evaluation = new Evaluation(req.body);
        await evaluation.save();
        res.status(201).json({ status: "OK", data: evaluation });
    } catch (error) {
        next(error);
    }
};

// Cập nhật Evaluation
const updateEvaluation = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ status: "ERR", message: "Invalid ID" });
        }
        const evaluation = await Evaluation.findByIdAndUpdate(id, req.body, { new: true });
        if (!evaluation) return res.status(404).json({ status: "ERR", message: "Evaluation not found" });
        res.status(200).json({ status: "OK", data: evaluation });
    } catch (error) {
        next(error);
    }
};

// Xóa Evaluation
const deleteEvaluation = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ status: "ERR", message: "Invalid ID" });
        }
        const evaluation = await Evaluation.findByIdAndDelete(id);
        if (!evaluation) return res.status(404).json({ status: "ERR", message: "Evaluation not found" });
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

// Tìm kiếm Evaluation theo intern_id và type
const searchEvaluations = async (req, res, next) => {
    try {
        const { intern_id, type } = req.query;
        console.log("Received Query Params:", { intern_id, type });

        if (!intern_id || !type) {
            return res.status(400).json({ status: "ERR", message: "Both intern_id and type are required." });
        }

        // Kiểm tra intern_id có hợp lệ không
        if (!mongoose.Types.ObjectId.isValid(intern_id)) {
            return res.status(400).json({ status: "ERR", message: "Invalid intern_id format." });
        }

        // Tạo ObjectId hợp lệ
        const objectIdInternId = new mongoose.Types.ObjectId(intern_id);

        console.log("Searching Evaluations with:", { intern_id: objectIdInternId, type });

        const evaluations = await Evaluation.find({
            intern_id: objectIdInternId,
            type: type.trim().toUpperCase(),
        }).populate("intern_id project_id mentor_id position_id");

        console.log("Found Evaluations:", evaluations);

        if (evaluations.length === 0) {
            return res.status(404).json({ status: "ERR", message: "No evaluations found." });
        }

        return res.status(200).json({ status: "OK", data: evaluations });
    } catch (error) {
        console.error("Error in searchEvaluations:", error);
        return res.status(500).json({ status: "ERR", message: "Internal Server Error" });
    }
};

module.exports = {
    getAllEvaluations,
    getEvaluationById,
    createEvaluation,
    updateEvaluation,
    deleteEvaluation,
    searchEvaluations,
};