const Recruitment = require("../models/RecruitmentModel");
const mongoose = require('mongoose')

const createRecruitment = async (req, res, next) => {
    try {
        const sender_id = req.user.payload.id; // Lấy ID từ middleware
        console.log(sender_id)
        const { receiver_id, recruit_description, recruit_img, recruit_title, date_start, date_end } = req.body;

        console.log(req.body);

        if (!mongoose.Types.ObjectId.isValid(receiver_id)) {
            return res.status(400).json({
                status: "ERR",
                message: "Invalid receiver_id",
            });
        }

        // Tạo recruitment mới
        const newRecruitment = new Recruitment({
            sender_id, // ID của mentor từ middleware
            receiver_id, // ID của HR từ request body
            recruit_description,
            recruit_img,
            recruit_title,
            date_start,
            date_end,
        });

        await newRecruitment.save();

        res.status(201).json({
            status: "SUCCESS",
            message: "Recruitment sent successfully",
            data: {
                recruitment: newRecruitment,
            },
        });
    } catch (error) {
        next(error);
    }
};


const getAllRecruitments = async (req, res, next) => {
    try {
        const recruitments = await Recruitment.find().populate("sender_id receiver_id", "first_name last_name email");

        res.status(200).json({
            status: "SUCCESS",
            message: "Fetched all recruitments successfully",
            data: recruitments,
        });
    } catch (error) {
        next(error);
    }
};
const getAllRecruitmentsByMentorId = async (req, res, next) => {
    try {
        const { id } = req.params
        const recruitments = await Recruitment.find({ sender_id: id }).populate("sender_id receiver_id", "first_name last_name email");

        res.status(200).json({
            status: "SUCCESS",
            message: "Fetched all recruitments successfully",
            data: recruitments,
        });
    } catch (error) {
        next(error);
    }
};
const updateRecruitment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { recruit_description, recruit_img, recruit_title, date_start, date_end } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ status: "ERR", message: "Invalid recruitment ID" });
        }

        const updatedRecruitment = await Recruitment.findByIdAndUpdate(
            id,
            { recruit_description, recruit_img, recruit_title, date_start, date_end },
            { new: true }
        );

        if (!updatedRecruitment) {
            return res.status(404).json({ status: "ERR", message: "Recruitment not found" });
        }

        res.status(200).json({
            status: "SUCCESS",
            message: "Recruitment updated successfully",
            data: updatedRecruitment,
        });
    } catch (error) {
        next(error);
    }
};

const deleteRecruitment = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ status: "ERR", message: "Invalid recruitment ID" });
        }

        const deletedRecruitment = await Recruitment.findByIdAndDelete(id);

        if (!deletedRecruitment) {
            return res.status(404).json({ status: "ERR", message: "Recruitment not found" });
        }

        res.status(200).json({
            status: "SUCCESS",
            message: "Recruitment deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};
module.exports = {
    createRecruitment,
    getAllRecruitments,
    updateRecruitment,
    deleteRecruitment,
    getAllRecruitmentsByMentorId
};
