const Project = require("../models/ProjectModel");
const User = require("../models/UserModel");

const mongoose = require('mongoose')

const getMentorInfo = async (req, res, next) => {
    try {
        let { name } = req.query; // Lấy tham số tìm kiếm từ query
        name = name ? name.trim().replace(/\s+/g, " ") : ""; // Xóa khoảng trắng dư thừa
        console.log("Searching mentor with name:", name || "All mentors");

        // Tạo điều kiện tìm kiếm
        const query = { role: "MENTOR" };
        if (name) {
            query.$or = [
                { first_name: { $regex: name, $options: "i" } },
                { last_name: { $regex: name, $options: "i" } }
            ];
        }

        // Truy vấn danh sách mentor
        const mentors = await User.find(query)
            .select("roll_number first_name last_name avatar date_of_birth gender phone is_active")
            .lean();

        if (mentors.length === 0) {
            return res.status(404).json({
                status: "ERR",
                message: "No mentors found",
            });
        }

        // Lấy danh sách mentor ID
        const mentorIds = mentors.map(mentor => mentor._id);

        // Truy vấn danh sách dự án theo mentor ID
        const projects = await Project.find({ mentor_id: { $in: mentorIds } })
            .select("mentor_id project_name project_start project_end")
            .lean();

        // Kết hợp mentor với danh sách dự án của họ
        const mentorData = mentors.map(mentor => {
            const mentorProjects = projects
                .filter(project => project.mentor_id.toString() === mentor._id.toString())
                .map(project => ({
                    project_name: project.project_name,
                    project_start: project.project_start,
                    project_end: project.project_end
                }));

            return {
                mentor_id: mentor.roll_number,
                full_name: `${mentor.first_name} ${mentor.last_name}`,
                avatar: mentor.avatar || "default_avatar.png",
                date_of_birth: mentor.date_of_birth,
                gender: mentor.gender,
                phone: mentor.phone,
                active: mentor.is_active,
                projects: mentorProjects
            };
        });

        console.log("Mentor data retrieved:", mentorData);

        res.status(200).json({
            status: "SUCCESS",
            message: "Mentor information retrieved successfully",
            data: mentorData,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { 
    getMentorInfo 
};
