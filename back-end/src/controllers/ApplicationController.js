const Application = require("../models/ApplicationModel");
const User = require("../models/UserModel");

const applyForProject = async (req, res) => {
    try {
        const { roll_number, mentor_id, project_id, position_id } = req.body;

        // Tìm user theo roll_number
        const user = await User.findOne({ roll_number });
        console.log(user);
        if (!user) {
            return res.status(404).json({ success: false, message: "Mã số sinh viên không tồn tại" });
        }

        // Kiểm tra role có phải CANDIDATE không
        if (user.role !== "CANDIDATE") {
            console.log("Người dùng không có quyền apply:", user.role);
            return res.status(403).json({ success: false, message: "Bạn không có quyền apply vào dự án này!" });
        }

        // Kiểm tra xem thực tập sinh đã apply vào dự án này chưa
        const existingApplication = await Application.findOne({
            application_id: roll_number, // Kiểm tra theo roll_number
            project_id,
            position_id
        });

        if (existingApplication) {
            return res.status(400).json({ success: false, message: "Bạn đã apply vào dự án này rồi!" });
        }

        // Tạo bản ghi mới trong Application
        const newApplication = new Application({
            application_id: roll_number, // Lưu roll_number thay vì _id
            mentor_id,
            project_id,
            position_id,
            status: true // Mặc định khi apply là true
        });

        // Lưu vào database
        await newApplication.save();

        return res.status(201).json({ success: true, message: "Apply thành công!", data: newApplication });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

module.exports = { applyForProject };
