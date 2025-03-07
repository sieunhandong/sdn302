const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
    role_name: {
        type: String,
        required: true,
        unique: true, // Ngăn chặn trùng vai trò
        trim: true,   // Xoá khoảng trắng ở đầu và cuối
        enum: ["ADMIN", "MENTOR", "CANDIDATE", "INTERN", "HR"] // Giới hạn danh sách vai trò (tuỳ chọn)
    }
}, { timestamps: true }); // Tự động thêm createdAt và updatedAt

const Role = mongoose.model("Role", roleSchema);

module.exports = Role;
