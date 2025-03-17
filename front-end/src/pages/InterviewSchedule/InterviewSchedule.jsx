import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as ScheduleService from "../../services/ScheduleService";
import * as UserService from "../../services/UserService";
import { Table } from "antd";
import moment from "moment";
import { useSelector } from "react-redux";
const InterViewSchedule = () => {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([]);
  const [mentors, setMentors] = useState([]);

  const token = useSelector((state) => state.user?.access_token || "");
  const role = useSelector((state) => state.user?.role || "");
  const id = useSelector((state) => state.user?._id || "");
  console.log("role", role);

  // Fetch schedules từ API
  useEffect(() => {
    fetchSchedules();
    // fetchMentors();
  }, []);
  console.log("token: ", token);

  const fetchSchedules = async () => {
    try {
      const response = await ScheduleService.getScheduleByMentorId(token, id);
      setSchedules(response.data || []);
      console.log("Dữ liệu API trả về:", response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("Lỗi 401 Unauthorized khi lấy danh sách lịch");
        // Xử lý lỗi 401 Unauthorized, ví dụ như yêu cầu người dùng đăng nhập lại
      } else {
        console.error("Lỗi khi lấy danh sách lịch:", error);
      }
      setSchedules([]);
    }
  };

  //   const fetchMentors = async () => {
  //     try {
  //       const response = await UserService.getAllMentor(token);
  //       console.log("Mentor: ", response.data);
  //       setMentors(response.data || []);
  //     } catch (error) {
  //       console.error("Lỗi khi lấy danh sách mentor:", error);
  //     }
  //   };

  const columns = [
    {
      title: "Mentor",
      dataIndex: "mentor_id",
      key: "mentor_id",
      //   render: (mentor) =>
      //     mentor ? `${mentor.last_name} ${mentor.first_name}` : "Không có mentor",
    },
    {
      title: "Tên Dự Án",
      dataIndex: "project_id",
      key: "project_id",
      render: (project) => (project ? project.project_name : "Không có dự án"),
    },
    { title: "Tiêu đề", dataIndex: "title", key: "title" },
    { title: "Tin nhắn", dataIndex: "message", key: "message" },
    { title: "Thời gian", dataIndex: "time", key: "time" },
    {
      title: "Ngày bắt đầu",
      dataIndex: "date_start",
      key: "date_start",
      render: (date) =>
        date ? moment(date).format("DD/MM/YYYY") : "Không có ngày", // Xử lý trường hợp date là undefined
    },
    { title: "Phòng", dataIndex: "room", key: "room" },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h1>Quản lý Lịch Phỏng Vấn</h1>

      <Table
        dataSource={Array.isArray(schedules) ? schedules : []}
        columns={columns}
        rowKey={(record) => record._id || Math.random()}
      />
    </div>
  );
};

export default InterViewSchedule;
