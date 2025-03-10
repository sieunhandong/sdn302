const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
    {
        project_name: { type: String, required: [true, 'Project name is require'] },
        mentor_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        project_img: { type: String, required: false },
        project_details: { type: String, required: false },
        project_start: { type: Date, required: true },
        project_end: { type: Date, required: true },
    } 
);

const Project = mongoose.model("Project", projectSchema);
module.exports = Project;
