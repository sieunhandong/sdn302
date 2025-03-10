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


module.exports = {
    createProject
};
