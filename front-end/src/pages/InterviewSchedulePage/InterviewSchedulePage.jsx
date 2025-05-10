import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as ScheduleService from "../../services/ScheduleService";
import * as UserService from "../../services/UserService";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  message,
  Select,
} from "antd";
import moment from "moment";
import { useSelector } from "react-redux";

const InterviewSchedulePage = () => {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [form] = Form.useForm();
  const token = useSelector((state) => state.user?.access_token || "");
  const role = useSelector((state) => state.user?.role || "");

  // Fetch schedules từ API
  useEffect(() => {
    fetchSchedules();
    fetchMentors();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await ScheduleService.getAllSchedules(token);

      // const data = Array.isArray(response.data) ? response.data : [];
      setSchedules(response.data || []);
      console.log("Dữ liệu API trả về:", response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách lịch:", error);
      setSchedules([]); // Đảm bảo schedules luôn là mảng khi có lỗi
    }
  };

  const fetchMentors = async () => {
    try {
      const response = await UserService.getAllMentor(token);
      console.log("Mentor: ", response.data);
      setMentors(response.data || []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách mentor:", error);
    }
  };

  const showModal = (schedule = null) => {
    setEditingSchedule(schedule);
    form.setFieldsValue(
      schedule
        ? {
            ...schedule,
            date_start: moment(schedule.date_start),
          }
        : {
            mentor_id: "",
            project_id: "",
            title: "",
            message: "",
            time: "",
            date_start: null,
            room: "",
          }
    );
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const formattedValues = {
        ...values,
        date_start: values.date_start
          ? values.date_start.format("YYYY-MM-DD")
          : null,
      };

      if (editingSchedule) {
        await ScheduleService.updateSchedule(
          editingSchedule._id,
          formattedValues,
          token
        );
        message.success("Cập nhật lịch phỏng vấn thành công!");
      } else {
        await ScheduleService.createShedule(formattedValues, token);
        message.success("Thêm lịch phỏng vấn mới thành công!");
      }
      setIsModalOpen(false);
      fetchSchedules();
    } catch (error) {
      console.error("Lỗi khi lưu lịch:", error);
      message.error("Có lỗi xảy ra!");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Bạn có chắc chắn muốn xóa lịch này không?"
    );
    if (!confirmed) {
      return;
    }

    try {
      await ScheduleService.deleteSchedule(id, token);

      message.success("Xóa lịch phỏng vấn thành công!");
      fetchSchedules();
    } catch (error) {
      console.error("Lỗi khi xóa lịch:", error);
      message.error("Có lỗi xảy ra khi xóa lịch!");
    }
  };

  const columns = [
    {
      title: "Mentor",
      dataIndex: "mentor_id",
      key: "mentor_id",
      render: (mentor) =>
        mentor ? `${mentor.last_name} ${mentor.first_name}` : "Không có mentor",
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

    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span style={{ color: status ? "green" : "red", fontWeight: "bold" }}>
          {status ? "Hoạt động" : "Tạm dừng"}
        </span>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <>
          {role === "HR" && (
            <>
              <Button
                type="primary"
                onClick={() => showModal(record)}
                style={{ marginRight: 10 }}
              >
                Sửa
              </Button>
              <Button danger onClick={() => handleDelete(record._id)}>
                Xóa
              </Button>
            </>
          )}
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h1>Quản lý Lịch Phỏng Vấn</h1>
      {role === "HR" && (
        <Button
          type="primary"
          onClick={() => showModal()}
          style={{ marginBottom: 20 }}
        >
          Thêm mới
        </Button>
      )}
      <Table
        dataSource={Array.isArray(schedules) ? schedules : []}
        columns={columns}
        rowKey={(record) => record._id || Math.random()}
      />

      <Modal
        title={editingSchedule ? "Chỉnh sửa lịch" : "Thêm lịch"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="message"
            label="Tin nhắn"
            rules={[{ required: true, message: "Vui lòng nhập tin nhắn!" }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item
            name="time"
            label="Thời gian"
            rules={[{ required: true, message: "Vui lòng nhập thời gian!" }]}
          >
            <Input placeholder="HH:mm" />
          </Form.Item>
          <Form.Item name="date_start" label="Ngày bắt đầu">
            <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="room" label="Phòng">
            <Input />
          </Form.Item>
          <Form.Item
            name="mentor_id"
            label="Mentor"
            rules={[{ required: true, message: "Vui lòng chọn Mentor!" }]}
          >
            <Select placeholder="Chọn Mentor">
              {mentors.map((mentor) => (
                <Select.Option key={mentor._id} value={mentor._id}>
                  {`${mentor.last_name} ${mentor.first_name}`}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="project_id"
            label="Project ID"
            rules={[{ required: true, message: "Vui lòng nhập Project ID!" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default InterviewSchedulePage;
