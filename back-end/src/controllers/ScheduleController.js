const Schedule = require("../models/ScheduleModel");
const mongoose = require("mongoose");
const User = require("../models/UserModel");
const Project = require("../models/ProjectModel");

const createShedule = async (req, res, next) => {
  try {
    const { mentor_id, project_id, message, title, time, date_start, room } =
      req.body;

    const mentorExist = await User.findById(mentor_id);
    if (!mentorExist) {
      return res.status(404).json({
        status: "ERR",
        message: "Mentor not found",
      });
    }

    const projectExist = await Project.findById(project_id);
    if (!projectExist) {
      return res.status(404).json({
        status: "ERR",
        message: "Mentor not found",
      });
    }

    const currentDate = new Date();
    const startDate = new Date(date_start);
    if (startDate < currentDate) {
      return res.status(400).json({
        status: "ERR",
        message: "date_start must be greater than or equal to the current date",
      });
    }
    const newSchedule = new Schedule({
      mentor_id,
      project_id,
      message,
      title,
      time,
      date_start,
      room,
    });

    await newSchedule.save();
    res.status(201).json({
      status: "SUCCESS",
      message: "Schedule created successfully",
      data: {
        Schedule: newSchedule,
      },
    });
  } catch (error) {
    next(error);
  }
};

// const getAllSchedules = async (req, res, next) => {
//   try {
//     const schedules = await Schedule.find({ status: true });

//     res.status(200).json({
//       status: "SUCCESS",
//       data: schedules,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// const getAllSchedules = async (req, res, next) => {
//   try {
//     const schedules = await Schedule.find({ status: true }).populate(
//       "mentor_id",
//       "first_name last_name"
//     );

//     res.status(200).json({
//       status: "SUCCESS",
//       data: schedules,
//     });
//   } catch (error) {
//     next(error);
//   }
// };
const getAllSchedules = async (req, res, next) => {
  try {
    const schedules = await Schedule.find({ status: true })
      .populate("mentor_id", "first_name last_name") // Lấy tên của mentor
      .populate("project_id", "project_name"); // Lấy tên của dự án

    res.status(200).json({
      status: "SUCCESS",
      data: schedules,
    });
  } catch (error) {
    next(error);
  }
};

const deleteSchedule = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updatedSchedule = await Schedule.findByIdAndUpdate(
      id,
      { status: false },
      { new: true }
    );

    if (!updatedSchedule) {
      return res.status(404).json({
        status: "ERR",
        message: "Schedule not found",
      });
    }

    res.status(200).json({
      status: "SUCCESS",
      message: "Schedule deleted successfully (status updated to false)",
      data: {
        Schedule: updatedSchedule,
      },
    });
  } catch (error) {
    next(error);
  }
};
const updateSchedule = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const existingSchedule = await Schedule.findById(id);
    if (!existingSchedule || existingSchedule.status === false) {
      return res.status(404).json({
        status: "ERR",
        message: "Schedule not found or has been deleted",
      });
    }

    if (updates.mentor_id) {
      const mentorExist = await User.findById(updates.mentor_id);
      if (!mentorExist) {
        return res.status(404).json({
          status: "ERR",
          message: "Mentor not found",
        });
      }
    }

    if (updates.project_id) {
      const projectExist = await Project.findById(updates.project_id);
      if (!projectExist) {
        return res.status(404).json({
          status: "ERR",
          message: "Project not found",
        });
      }
    }

    if (updates.date_start) {
      const currentDate = new Date();
      const startDate = new Date(updates.date_start);
      if (startDate < currentDate) {
        return res.status(400).json({
          status: "ERR",
          message:
            "date_start must be greater than or equal to the current date",
        });
      }
    }

    const updatedSchedule = await Schedule.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "SUCCESS",
      message: "Schedule updated successfully",
      data: {
        Schedule: updatedSchedule,
      },
    });
  } catch (error) {
    next(error);
  }
};
const getScheduleByMentorId = async (req, res, next) => {
  try {
    const { mentor_id } = req.params;

    const mentorExist = await User.findById(mentor_id);
    if (!mentorExist) {
      return res.status(404).json({
        status: "ERR",
        message: "Mentor not found",
      });
    }

    const schedules = await Schedule.find({ mentor_id, status: true });

    res.status(200).json({
      status: "SUCCESS",
      data: {
        schedules,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createShedule,
  updateSchedule,
  getAllSchedules,
  deleteSchedule,
  getScheduleByMentorId,
};
