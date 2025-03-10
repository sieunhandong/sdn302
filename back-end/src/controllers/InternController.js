const Intern = require("../models/InternModel");
const Report = require("../models/ReportModel")
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
module.exports = {
    createIntern,
    createReport
};
