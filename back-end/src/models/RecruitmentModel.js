const mongoose = require('mongoose');

const recruitmentSchema = new mongoose.Schema(
    {
        sender_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        receiver_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        recruit_description: { type: String, required: true },
        recruit_img: { type: String, required: true },
        recruit_title: { type: String, required: true },
        status: {
            type: String,
            enum: ["PROCESS", "ACCEPT", "REJECT"],
            default: "PROCESS",
            index: true,
        },
        date_start: { type: Date, required: true },
        date_end: { type: Date, required: true },
    }
);

const Recruitment = mongoose.model("Recruitment", recruitmentSchema);
module.exports = Recruitment;
