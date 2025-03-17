const mongoose = require('mongoose');

const internSchema = new mongoose.Schema({
    intern_id: { type: mongoose.Schema.Types.ObjectId, ref: "Intern", required: true },
    project_id: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    mentor_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    position_id: { type: mongoose.Schema.Types.ObjectId, ref: "Position", required: true },
    type: {
        type: String,
        enum: ["MIDTERM", "FINAL"]
    },
    attitude_score: { type: Number },
    soft_skills_score: { type: Number },
    technical_skills_score: { type: Number },
    total_score: { type: Number },
    total_score: { type: Number },
    commnent: { type: String },
},
    { timestamps: true }
);

const Intern = mongoose.model("Intern", internSchema);
module.exports = Intern;
