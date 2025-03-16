const Intern = require("../models/InternModel");
const Report = require("../models/ReportModel");
const User = require("../models/UserModel");
const Project = require("../models/ProjectModel");
const Position = require("../models/PositionModel");

const mongoose = require('mongoose')

const createIntern = async (req, res, next) => {
    try {
        const { user_id, project_id, mentor_id, position_id } = req.body;

        console.log(req.body);

        if (!mongoose.Types.ObjectId.isValid(user_id)) {
            return res.status(400).json({
                status: "ERR",
                message: "Invalid user_id",
            });
        }
        if (!mongoose.Types.ObjectId.isValid(mentor_id)) {
            return res.status(400).json({
                status: "ERR",
                message: "Invalid mentor_id",
            });
        }
        if (!mongoose.Types.ObjectId.isValid(position_id)) {
            return res.status(400).json({
                status: "ERR",
                message: "Invalid position_id",
            });
        }
        if (!mongoose.Types.ObjectId.isValid(project_id)) {
            return res.status(400).json({
                status: "ERR",
                message: "Invalid project_id",
            });
        }

        // Tạo recruitment mới
        const newRecruitment = new Intern({
            user_id, // ID của mentor từ middleware
            project_id, // ID của HR từ request body
            mentor_id,
            position_id,
        });

        await newRecruitment.save();

        res.status(201).json({
            status: "SUCCESS",
            message: "Intern create successfully",
            data: {
                intern: newRecruitment,
            },
        });
    } catch (error) {
        next(error);
    }
};

const createReport = async (req, res, next) => {
    try {
        const { intern_id, mentor_id, week, report, report_link, project_id } = req.body;

        console.log(req.body);

        if (!mongoose.Types.ObjectId.isValid(intern_id)) {
            return res.status(400).json({
                status: "ERR",
                message: "Invalid intern_id",
            });
        }
        if (!mongoose.Types.ObjectId.isValid(mentor_id)) {
            return res.status(400).json({
                status: "ERR",
                message: "Invalid mentor_id",
            });
        }
        if (!mongoose.Types.ObjectId.isValid(project_id)) {
            return res.status(400).json({
                status: "ERR",
                message: "Invalid project_id",
            });
        }

        // Tạo recruitment mới
        const newRecruitment = new Report({
            intern_id,
            mentor_id,
            week,
            report,
            report_link,
            project_id
        });

        await newRecruitment.save();

        res.status(201).json({
            status: "SUCCESS",
            message: "Intern create successfully",
            data: {
                report: newRecruitment,
            },
        });
    } catch (error) {
        next(error);
    }
};

// Get list interns by project id
const getInternsByProject = async (req, res, next) => {
    try {
        const { project_id } = req.params;

        if (!project_id) {
            return res.status(400).json({
                status: "ERR",
                message: "Project ID is required",
            });
        }

        const interns = await Intern.find({ project_id })
            .populate("user_id", "roll_number first_name last_name avatar gender date_of_birth phone specialization is_active")
            .populate("mentor_id", "first_name last_name")
            .populate("position_id", "position_name");

        if (!interns.length) {
            return res.status(404).json({
                status: "ERR",
                message: "No interns found for this project",
            });
        }

        res.status(200).json({
            status: "SUCCESS",
            message: "Interns retrieved successfully",
            data: interns,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createIntern,
    createReport,
    getInternsByProject,
};
