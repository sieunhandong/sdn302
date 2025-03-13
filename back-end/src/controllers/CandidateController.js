const Project = require("../models/ProjectModel");
const User = require("../models/UserModel");
const Position = require("../models/PositionModel");
const Application = require("../models/ApplicationModel");

const mongoose = require('mongoose')

const getCandidatesByMentor = async (req, res, next) => {
    try {
        const { mentor_id } = req.params;
        console.log("Fetching candidates for Mentor ID:", mentor_id);

        // 🔍 Tìm tất cả projects do mentor này phụ trách
        const projects = await Project.find({ mentor_id }).lean();
        if (!projects.length) {
            return res.status(404).json({ status: "ERR", message: "No projects found for this mentor" });
        }

        // Lấy danh sách tất cả project ID
        const projectIds = projects.map(proj => proj._id);

        // 🔍 Tìm tất cả positions trong các projects này
        const positions = await Position.find({ project_id: { $in: projectIds } }).lean();
        if (!positions.length) {
            return res.status(404).json({ status: "ERR", message: "No positions found for these projects" });
        }

        // Lấy danh sách position ID
        const positionIds = positions.map(pos => pos._id);

        // 🔍 Tìm các ứng viên đã apply vào các positions này
        const applications = await Application.find({ position_id: { $in: positionIds } }).lean();
        if (!applications.length) {
            return res.status(404).json({ status: "ERR", message: "No candidates applied for this mentor's projects" });
        }

        // Lấy danh sách user ID từ applications
        const candidateIds = applications.map(app => app.user_id);

        // 🔍 Truy vấn thông tin của các ứng viên
        const candidates = await User.find({ _id: { $in: candidateIds } })
            .select("roll_number first_name last_name avatar date_of_birth gender phone specialization is_active")
            .lean();

        // Gán thông tin candidates vào danh sách
        const candidateData = candidates.map(candidate => {
            const appliedApplication = applications.find(app => app.user_id.equals(candidate._id));
            const appliedPosition = positions.find(pos => pos._id.equals(appliedApplication?.position_id));
            const appliedProject = projects.find(proj => proj._id.equals(appliedApplication?.project_id));

            return {
                user_id: candidate.roll_number,
                full_name: `${candidate.first_name} ${candidate.last_name}`,
                avatar: candidate.avatar || "default_avatar.png",
                specialization: candidate.specialization || "N/A",
                project_name: appliedProject ? appliedProject.project_name : "Unknown",
                position_name: appliedPosition ? appliedPosition.position_name : "Unknown",
                date_of_birth: candidate.date_of_birth,
                gender: candidate.gender,
                phone: candidate.phone,
                status: candidate.is_active ? "Active" : "Inactive"
            };
        });

        console.log("Candidates retrieved:", candidateData);

        res.status(200).json({
            status: "SUCCESS",
            message: "Candidates retrieved successfully",
            data: candidateData,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { 
    getCandidatesByMentor 
};
