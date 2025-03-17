const Report = require("../models/ReportModel");
const Intern = require("../models/InternModel");
const User = require("../models/UserModel");
const Project = require("../models/ProjectModel");
const Position = require("../models/PositionModel");

const viewlistreport = async (req, res) => {
    try {
        console.log("Request User:", req.user); // Kiểm tra user có tồn tại không

        // Kiểm tra nếu req.user không hợp lệ
        if (!req.user || typeof req.user !== 'object') {
            return res.status(401).json({ success: false, message: "Unauthorized: User not found" });
        }
        const mentorId = req.user.payload.id; // Lấy mentor_id từ middleware

        // Tìm các project mà mentor đang quản lý
        const projects = await Project.find({ mentor_id: mentorId }).select("_id");
        const projectIds = projects.map(p => p._id); // Chuyển thành mảng project_id

        // Tìm các intern thuộc các project này
        const interns = await Intern.find({ project_id: { $in: projectIds } }).select("_id user_id project_id position_id");
        const internIds = interns.map(i => i._id);

        // Lấy danh sách báo cáo của các intern trong dự án của mentor
        const reports = await Report.find({ intern_id: { $in: internIds } }).select("intern_id week report report_link");

        let formattedReports = [];
        for (let report of reports) {
            const intern = interns.find(i => i._id.toString() === report.intern_id.toString());
            if (!intern) continue;

            const user = await User.findById(intern.user_id).select("first_name last_name");
            const project = projects.find(p => p._id.toString() === intern.project_id.toString());
            const position = await Position.findById(intern.position_id).select("position_name");

            formattedReports.push({
                intern_id: intern._id,
                full_name: user ? `${user.first_name} ${user.last_name}` : "N/A",
                project_name: project ? project.project_name : "N/A",
                position_name: position ? position.position_name : "N/A",
                week: report.week,
                report: report.report,
                report_link: report.report_link
            });
        }

        res.status(200).json({ success: true, data: formattedReports });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

module.exports = { viewlistreport };
