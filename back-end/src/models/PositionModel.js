const mongoose = require('mongoose');

const positionSchema = new mongoose.Schema(
    {
        position_name: { type: String, required: [true, 'Project name is require'] },
        project_id: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
        position_count: { type: Number, required: false },
        project_details: { type: String, required: false },
        required_skills: [{ type: String }] 
    }
);

const Position = mongoose.model("Position", positionSchema);
module.exports = Position;
