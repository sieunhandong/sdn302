const ReportModel = require("../models/ReportModel");
const mongoose = require("mongoose");

// Get all reports
const getAllReports = async (req, res, next) => {
    try {
        const reports = await ReportModel.find().populate("intern_id project_id mentor_id");
        res.status(200).json({ status: "OK", data: reports });
    } catch (error) {
        next(error);
    }
};

// Get report by ID
const getReportById = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ status: "ERR", message: "Invalid ID" });
        }
        const report = await ReportModel.findById(id).populate("intern_id project_id mentor_id");
        if (!report) return res.status(404).json({ status: "ERR", message: "Report not found" });
        res.status(200).json({ status: "OK", data: report });
    } catch (error) {
        next(error);
    }
};

// Create new report
const createReport = async (req, res, next) => {
    try {
        const report = new ReportModel(req.body);
        await report.save();
        res.status(201).json({ status: "OK", data: report });
    } catch (error) {
        next(error);
    }
};

// Update report
const updateReport = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ status: "ERR", message: "Invalid ID" });
        }
        const report = await ReportModel.findByIdAndUpdate(id, req.body, { new: true });
        if (!report) return res.status(404).json({ status: "ERR", message: "Report not found" });
        res.status(200).json({ status: "OK", data: report });
    } catch (error) {
        next(error);
    }
};

// Delete report
const deleteReport = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ status: "ERR", message: "Invalid ID" });
        }
        const report = await ReportModel.findByIdAndDelete(id);
        if (!report) return res.status(404).json({ status: "ERR", message: "Report not found" });
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllReports,
    getReportById,
    createReport,
    updateReport,
    deleteReport,
};
