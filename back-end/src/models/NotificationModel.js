const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    sender_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    receiver_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    project_id: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    position_id: { type: mongoose.Schema.Types.ObjectId, ref: "Position" },
    message: { type: String, required: true },
    title: { type: String, required: true },
    published_date: { type: Date },
    meet_link: { type: String },
    room: { type: String }
}, { timestamps: true });

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
