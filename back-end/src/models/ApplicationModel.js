const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
    {
        applicant_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        mentor_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        project_id: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
        position_id: { type: mongoose.Schema.Types.ObjectId, ref: "Position", required: true },
        status: { type: Boolean, required: true, default: true },
    }
);

const Project = mongoose.model("Project", projectSchema);
module.exports = Project;
