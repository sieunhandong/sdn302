const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    intern_id: { type: mongoose.Schema.Types.ObjectId, ref: "Intern" },
    mentor_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    week: { type: Number, required: true },
    report: { type: String, required: true },
    report_link: { type: String },
    project_id: { type: mongoose.Schema.Types.ObjectId, ref: "Project" }
}, { timestamps: true });

const Report = mongoose.model("Report", reportSchema);
module.exports = Report;
