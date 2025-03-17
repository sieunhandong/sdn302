const Project = require("../models/ProjectModel");
const User = require("../models/UserModel");
const Position = require("../models/PositionModel");
const Application = require("../models/ApplicationModel");

const mongoose = require('mongoose')

//danh sách candidate ứng tuyển theo 1 mentor
const getCandidatesByMentor = async (req, res, next) => {
    try {
        const { mentor_id } = req.params;

        const projects = await Project.find({ mentor_id }).lean();
        if (!projects.length) return res.status(404).json({ status: "ERR", message: "No projects found" });

        const projectIds = projects.map(p => p._id);
        const positions = await Position.find({ project_id: { $in: projectIds } }).lean();
        if (!positions.length) return res.status(404).json({ status: "ERR", message: "No positions found" });

        const positionIds = positions.map(p => p._id);
        const applications = await Application.find({ position_id: { $in: positionIds } }).lean();
        if (!applications.length) return res.status(404).json({ status: "ERR", message: "No candidates applied" });

        const candidateIds = applications.map(a => a.user_id);
        const candidates = await User.find({ _id: { $in: candidateIds } })
            .select("roll_number first_name last_name avatar date_of_birth gender phone specialization is_active")
            .lean();

        const candidateData = candidates.map(c => {
            const app = applications.find(a => a.user_id.equals(c._id));
            return {
                user_id: c.roll_number,
                full_name: `${c.first_name} ${c.last_name}`,
                avatar: c.avatar || "default_avatar.png",
                specialization: c.specialization || "N/A",
                project_name: projects.find(p => p._id.equals(app?.project_id))?.project_name || "Unknown",
                position_name: positions.find(p => p._id.equals(app?.position_id))?.position_name || "Unknown",
                date_of_birth: c.date_of_birth,
                gender: c.gender,
                phone: c.phone,
                status: c.is_active ? "Active" : "Inactive"
            };
        });

        res.status(200).json({ status: "SUCCESS", message: "Candidates retrieved", data: candidateData });
    } catch (error) {
        next(error);
    }
};

//danh sách candidate ứng tuyển của 1 project
const getCandidatesByProjectId = async (req, res, next) => {
    try {
        const { project_id } = req.params;
        console.log("project_id", project_id)
        // Tìm các vị trí thuộc dự án
        const positions = await Position.find({ project_id }).lean();
        if (!positions.length) return res.status(404).json({ status: "ERR", message: "No positions found for this project" });

        const positionIds = positions.map(p => p._id);

        // Tìm các ứng viên đã apply vào các vị trí trong project
        const applications = await Application.find({ project_id: project_id });
        if (!applications.length) return res.status(404).json({ status: "ERR", message: "No candidates applied for this project" });

        const candidateIds = applications.map(a => a.applicant_id);

        // Lấy thông tin ứng viên từ bảng User
        const candidates = await User.find({ _id: { $in: candidateIds } })
            .select("roll_number first_name last_name avatar date_of_birth gender phone specialization is_active")
            .lean();

        // Tạo danh sách ứng viên với thông tin đầy đủ
        const candidateData = candidates.map(c => {
            const app = applications.find(a => a.applicant_id.equals(c._id));
            const position = positions.find(p => p._id.equals(app?.position_id));

            return {
                roll_number: c.roll_number,
                full_name: `${c.first_name} ${c.last_name}`,
                avatar: c.avatar || "default_avatar.png",
                specialization: c.specialization || "N/A",
                position_name: position?.position_id || "Unknown",
                date_of_birth: c.date_of_birth,
                gender: c.gender,
                phone: c.phone,
                status: c.is_active ? "Active" : "Inactive"
            };
        });

        res.status(200).json({ status: "SUCCESS", message: "Candidates retrieved successfully", data: candidateData });
    } catch (error) {
        next(error);
    }
};

//cập nhật candidate lên intern
const acceptCandidate = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { projectId, candidateId } = req.params;

        // Tìm và kiểm tra ứng viên trong Application
        const application = await Application.findOne({ applicant_id: candidateId })
            .populate("position_id")
            .session(session);

        if (!application || !application.position_id || application.position_id.project_id.toString() !== projectId) {
            await session.abortTransaction();
            return res.status(404).json({ status: "ERR", message: "Candidate has not applied for this project" });
        }

        // Tạo Intern từ Application
        const newIntern = await Intern.create(
            [{
                user_id: candidateId,
                project_id: projectId,
                position_id: application.position_id._id,
                start_date: new Date(),
                status: "Active",
            }],
            { session }
        );

        // Cập nhật vai trò của ứng viên thành INTERN
        const updatedUser = await User.findByIdAndUpdate(candidateId, { role: "INTERN" }, { new: true }).session(session);
        if (!updatedUser) {
            await session.abortTransaction();
            return res.status(404).json({ status: "ERR", message: "Candidate not found" });
        }

        // Xóa ứng viên khỏi Application
        await Application.deleteOne({ applicant_id: candidateId }).session(session);

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ status: "SUCCESS", message: "Candidate accepted as Intern", data: newIntern });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
};
const apply = async (req, res, next) => {
    try {
        const { applicant_id, mentor_id, project_id, position_id } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!applicant_id || !mentor_id || !project_id || !position_id) {
            return res.status(400).json({
                status: "ERR",
                message: "Missing required fields",
            });
        }

        // Kiểm tra xem ứng viên đã apply vào project này chưa
        const existingApplication = await Application.findOne({
            applicant_id,
            project_id,
            position_id,
        });

        if (existingApplication) {
            return res.status(400).json({
                status: "ERR",
                message: "You have already applied for this position in the project",
            });
        }

        // Tạo đơn ứng tuyển mới
        const newApplication = new Application({
            applicant_id,
            mentor_id,
            project_id,
            position_id,
            status: true,
        });

        // Lưu vào database
        await newApplication.save();

        res.status(201).json({
            status: "SUCCESS",
            message: "Application submitted successfully",
            data: newApplication,
        });

    } catch (error) {
        console.error("Error in apply API:", error);
        next(error);
    }
};

module.exports = {
    getCandidatesByMentor,
    getCandidatesByProjectId,
    acceptCandidate,
    apply
};