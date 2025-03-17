const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema(
  {
    // sender_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    mentor_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    project_id: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    message: { type: String, required: true },
    title: { type: String, required: true },
    time: {
      type: String,
      validate: {
        validator: function (v) {
          return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v);
        },
        message: (props) =>
          `${props.value} is not a valid time format! Use HH:mm (24-hour format)`,
      },
    },
    date_start: { type: Date },
    room: { type: String },
    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Schedule = mongoose.model("Schedule", scheduleSchema);
module.exports = Schedule;
