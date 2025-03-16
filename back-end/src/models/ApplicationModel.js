const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
    {
        applicant_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        mentor_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        project_id: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
        position_id: { type: mongoose.Schema.Types.ObjectId, ref: "Position", required: true },
        status: { type: Boolean, required: true, default: true },
    }
);

const Application = mongoose.model("Application", applicationSchema);
module.exports = Application;
