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
        const projects = await Project.find({}).populate('mentor_id');
        console.log(projects);
        if(projects == null) {
            res.status(404).json({
                message: "Project not found"
            })
        }
        res.status(200).json({
            status: "SUCCESS",
            message: "List all projects",
            data: {
                projects,
            },
        });
    } catch (error) {
        next(error);
    }
}

// List Project detail by id
const listProjectDetail = async (req, res, next) => {
    try {
        const { id } = req.params;
        const project = await Project.findById(id).populate('mentor_id');
        if(project == null) {
            res.status(404).json({
                message: "Project not found"
            })
        }
        res.status(200).json({
            status: "SUCCESS",
            message: "List project detail",
            data: {
                project,
            },
        });
    } catch (error) {
        next(error);
    }
}

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


// Update project by id
const updateProject = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { project_name, mentor_id,project_img, project_details, project_start, project_end } = req.body;
        const project = await Project.findByIdAndUpdate(id, { project_name, mentor_id, project_img, project_details, project_start, project_end }, { new: true });
        if(project == null) {
            res.status(404).json({
                message: "Project not found"
            })
        }
        res.status(200).json({
            status: "SUCCESS",
            message: "Update project by id",
            data: {
                project,
            },
        });
    } catch (error) {
        next(error);
    }
}
      
// Delete project by id
const deleteProject = async (req, res, next) => {
    try {
        const { id } = req.params;
        const project = await Project.findByIdAndDelete(id);
        if(project == null) {
            res.status(404).json({
                message: "Project not found"
            })
        }
        res.status(200).json({
            status: "SUCCESS",
            message: "Project deleted successfully",
            data: {
                project,
            },
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createProject,
    listAllProjects,
    listProjectDetail,
    searchProjectByName,
    updateProject,
    deleteProject
};

