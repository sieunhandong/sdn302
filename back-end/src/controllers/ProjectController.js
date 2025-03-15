const Project = require("../models/ProjectModel");
const Position = require("../models/PositionModel");
const mongoose = require('mongoose')

const createProject = async (req, res, next) => {
    try {
        const { project_name, mentor_id, project_img, project_details, project_start, project_end, positions } = req.body;

        console.log(req.body);

        if (!mongoose.Types.ObjectId.isValid(mentor_id)) {
            return res.status(400).json({
                status: "ERR",
                message: "Invalid mentor_id",
            });
        }

        // 1️⃣ **Tạo Project mới**
        const newProject = new Project({
            project_name,
            mentor_id,
            project_img,
            project_details,
            project_start,
            project_end,
        });

        await newProject.save(); // Lưu Project vào database

        // 2️⃣ **Tạo danh sách Positions cho Project này**
        let createdPositions = [];
        if (Array.isArray(positions) && positions.length > 0) {
            createdPositions = await Position.insertMany(
                positions.map(pos => ({
                    project_id: newProject._id, // Gán project_id vào từng Position
                    position_name: pos.position_name,
                    position_description: pos.position_description,
                    required_skills: pos.required_skills || [],
                }))
            );
        }

        res.status(201).json({
            status: "SUCCESS",
            message: "Project and positions created successfully",
            data: {
                project: newProject,
                positions: createdPositions,
            },
        });
    } catch (error) {
        next(error);
    }
};
//List all projects
const listAllProjects = async (req, res, next) => {
    try {
        const projects = await Project.find({})
            .populate('mentor_id', 'last_name first_name');

        if (!projects || projects.length === 0) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        // Chuyển đổi dữ liệu trước khi gửi response
        const formattedProjects = projects.map(project => ({
            ...project._doc,
            mentor_name: `${project.mentor_id.last_name} ${project.mentor_id.first_name}`,
            project_start: new Date(project.project_start).toLocaleDateString("vi-VN"), // Định dạng DD/MM/YYYY
            project_end: new Date(project.project_end).toLocaleDateString("vi-VN")
        }));

        res.status(200).json({
            status: "SUCCESS",
            message: "List all projects",
            data: formattedProjects,
        });
    } catch (error) {
        next(error);
    }
};


// List Project detail by id
const listProjectDetail = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Tìm thông tin dự án và populate mentor
        const project = await Project.findById(id).populate('mentor_id', 'first_name last_name');

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        // Lấy danh sách position của project
        const positions = await Position.find({ project_id: id });

        // Định dạng dữ liệu trả về
        const formattedProject = {
            ...project._doc,
            mentor_name: `${project.mentor_id.last_name} ${project.mentor_id.first_name}`,
            project_start: new Date(project.project_start).toLocaleDateString("vi-VN"),
            project_end: new Date(project.project_end).toLocaleDateString("vi-VN"),
            positions // Thêm danh sách vị trí vào kết quả trả về
        };

        res.status(200).json({
            status: "SUCCESS",
            message: "Project detail retrieved successfully",
            data: formattedProject,
        });
    } catch (error) {
        next(error);
    }
};
const deleteProject = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Cập nhật status thành false
        const project = await Project.findByIdAndUpdate(
            id,
            { status: false },
            { new: true, runValidators: true } // Trả về dữ liệu mới sau khi cập nhật
        );

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        res.status(200).json({
            status: "SUCCESS",
            message: "Project status updated to inactive",
            data: project,
        });
    } catch (error) {
        next(error);
    }
};

const updateProject = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = req.body; // Lấy dữ liệu từ request body

        // Cập nhật dự án với dữ liệu mới
        const project = await Project.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true } // Trả về dữ liệu sau khi cập nhật, kiểm tra ràng buộc
        );

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        res.status(200).json({
            status: "SUCCESS",
            message: "Project updated successfully",
            data: project,
        });
    } catch (error) {
        next(error);
    }
};

// Search project by name
const searchProjectByName = async (req, res, next) => {
    try {
        const { name } = req.params;
        const projects = await Project.find({ project_name: new RegExp(name.trim(), 'i') }).populate('mentor_id');

        if (projects.length === 0) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.status(200).json({
            status: "SUCCESS",
            message: "Search project by name",
            data: { projects },
        });
    } catch (error) {
        next(error);
    }
};

// Lấy danh sách tất cả Positions của một Project
const getProjectPositions = async (req, res, next) => {
    try {
        const { id } = req.params;
        console.log("ID found:", id);
        // Lấy danh sách Positions theo project_id
        const positions = await Position.find({ project_id: id });
        console.log("Positions found:", positions);
        if (positions.length === 0) {
            return res.status(404).json({
                status: "ERR",
                message: "No positions found for this project",
            });
        }
        console.log("Positions found:", positions);

        res.status(200).json({
            status: "SUCCESS",
            message: "Positions retrieved successfully",
            data: positions,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createProject,
    listAllProjects,
    listProjectDetail,
    searchProjectByName,
    updateProject,
    deleteProject,
    getProjectPositions
};

