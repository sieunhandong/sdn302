const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
    sender_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    mentor_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    project_id: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    message: { type: String, required: true },
    title: { type: String, required: true },
    time: { type: String },
    date_start: { type: Date },
    room: { type: String }
}, { timestamps: true });

const Schedule = mongoose.model("InterviewSchedule", scheduleSchema);
module.exports = Schedule;
