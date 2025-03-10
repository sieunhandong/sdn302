const mongoose = require('mongoose');

const internSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    project_id: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    mentor_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    position_id: { type: mongoose.Schema.Types.ObjectId, ref: "Position", required: true }
}, { timestamps: true });

const Intern = mongoose.model("Intern", internSchema);
module.exports = Intern;
