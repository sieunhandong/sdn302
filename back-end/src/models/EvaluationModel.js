const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema({
    intern_id: { type: mongoose.Schema.Types.ObjectId, ref: "Intern", required: true },
    project_id: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    mentor_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    position_id: { type: mongoose.Schema.Types.ObjectId, ref: "Position", required: true },
    type: {
        type: String,
        enum: ["MIDTERM", "FINAL"]
    },
    comment: { type: String },
    attitude_score: { type: Number },
    soft_skills_score: { type: Number },
    technical_skills_score: { type: Number },
    total_score: { type: Number },
},
    { timestamps: true }
);

const Evaluation = mongoose.model("Evaluation", evaluationSchema);
module.exports = Evaluation;
