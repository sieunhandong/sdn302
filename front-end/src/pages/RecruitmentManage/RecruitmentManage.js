import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, DatePicker, message, Spin, Select } from "antd";
import { useSelector } from "react-redux";
import * as RecruitmentService from "../../services/RecruitmentService";
import * as UserService from "../../services/UserService";
import moment from "moment";
const { Option } = Select;
const RecruitmentManagement = () => {
    const [recruitments, setRecruitments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editRecruitment, setEditRecruitment] = useState(null);
    const [hrList, setHrList] = useState([]); // Danh sách HR
    const [form] = Form.useForm();
    const token = useSelector((state) => state.user.access_token);
    const id = useSelector((state) => state.user.id);

    // Fetch recruitments
    useEffect(() => {
        fetchRecruitments();
        fetchHrList();
    }, []);

    const fetchRecruitments = async () => {
        setLoading(true);
        try {
            const res = await RecruitmentService.getAllRecruitmentsByMentorId(id, token);
            if (res.status === "SUCCESS") {
                setRecruitments(res.data);
            } else {
                message.error("Failed to fetch recruitments");
            }
        } catch (error) {
            message.error("Error fetching recruitments");
        } finally {
            setLoading(false);
        }
    };
    const fetchHrList = async () => {
        try {
            const res = await UserService.getAllHr(token);
            console.log("API Response:", res);

            if (res.status === "OK" && Array.isArray(res.data)) {
                setHrList(res.data); // Dữ liệu đúng rồi, chỉ cần set
                console.log("Updated HR List:", res.data);
            } else {
                message.error("Failed to fetch HR list");
            }
        } catch (error) {
            message.error("Error fetching HR list");
        }
    };

    console.log("list", hrList)
    // Handle Add/Edit Recruitment
    const handleSubmit = async (values) => {
        const payload = {
            ...values,
            date_start: values.date_start.format("YYYY-MM-DD"),
            date_end: values.date_end.format("YYYY-MM-DD"),
            image: values.image || "", // Lưu ảnh dưới dạng text (URL)
        };

        if (editRecruitment) {
            const res = await RecruitmentService.updateRecruitment(editRecruitment._id, payload, token);
            if (res.status === "SUCCESS") {
                message.success("Recruitment updated successfully");
            } else {
                message.error("Failed to update recruitment");
            }
        } else {
            const res = await RecruitmentService.createRecruitment(payload, token);
            if (res.status === "SUCCESS") {
                message.success("Recruitment created successfully");
            } else {
                message.error("Failed to create recruitment");
            }
        }

        setModalVisible(false);
        setEditRecruitment(null);
        fetchRecruitments();
    };

    // Handle Delete
    const handleDelete = async (id) => {
        Modal.confirm({
            title: "Are you sure you want to delete this recruitment?",
            onOk: async () => {
                const res = await RecruitmentService.deleteRecruitment(id, token);
                if (res.status === "SUCCESS") {
                    message.success("Recruitment deleted successfully");
                    fetchRecruitments();
                } else {
                    message.error("Failed to delete recruitment");
                }
            },
        });
    };

    // Handle Open Modal for Edit
    const handleEdit = (record) => {
        setEditRecruitment(record);
        form.setFieldsValue({
            ...record,
            date_start: moment(record.date_start),
            date_end: moment(record.date_end),
            receiver_id: record.receiver_id,
        });
        setModalVisible(true);
    };


    return (
        <div style={{ maxWidth: "1200px", margin: "auto", padding: "20px" }}>
            <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Recruitment Management</h1>
            <Button type="primary" onClick={() => { form.resetFields(); setModalVisible(true); }}>Add Recruitment</Button>

            {loading ? (
                <Spin size="large" style={{ display: "block", margin: "20px auto" }} />
            ) : (
                <Table
                    dataSource={recruitments}
                    rowKey="_id"
                    columns={[
                        { title: "Title", dataIndex: "recruit_title", key: "recruit_title" },
                        {
                            title: "HR Receiver",
                            dataIndex: "receiver_id",
                            key: "receiver_id",
                            render: (receiver) => {
                                console.log("Looking for HR with ID:", receiver);

                                // Trích xuất _id từ object nếu receiver là object
                                const receiverId = receiver?._id || receiver;

                                if (!receiverId) return "No HR Assigned"; // Nếu không có HR, hiển thị thông báo phù hợp
                                if (!hrList || hrList.length === 0) return "Loading...";

                                // Tìm kiếm HR trong danh sách
                                const hr = hrList.find((hr) => hr._id === receiverId);
                                console.log("Matched HR:", hr);

                                return hr ? `${hr.roll_number} - ${hr.first_name} ${hr.last_name || ""}` : "Unknown";
                            },
                        },
                        { title: "Description", dataIndex: "recruit_description", key: "recruit_description" },
                        { title: "Start Date", dataIndex: "date_start", key: "date_start" },
                        { title: "End Date", dataIndex: "date_end", key: "date_end" },
                        {
                            title: "Actions",
                            key: "actions",
                            render: (_, record) => (
                                <>
                                    <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
                                    <Button type="link" danger onClick={() => handleDelete(record._id)}>Delete</Button>
                                </>
                            ),
                        },
                    ]}
                    pagination={{ pageSize: 5 }}
                    bordered
                />
            )}

            {/* Modal for Adding/Editing Recruitment */}
            <Modal
                title={editRecruitment ? "Edit Recruitment" : "Add Recruitment"}
                open={modalVisible}
                onCancel={() => { setModalVisible(false); setEditRecruitment(null); }}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item name="recruit_title" label="Title" rules={[{ required: true, message: "Please enter title" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="recruit_description" label="Description" rules={[{ required: true, message: "Please enter description" }]}>
                        <Input.TextArea rows={4} />
                    </Form.Item>
                    <Form.Item name="receiver_id" label="Select HR" rules={[{ required: true, message: "Please select HR" }]}>
                        <Select placeholder="Select HR">
                            {hrList.map((hr) => (
                                <Option key={hr._id} value={hr._id}>
                                    {hr.roll_number} - {hr.first_name} {hr.last_name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="recruit_img" label="Image" rules={[{ required: true, message: "Please enter image" }]}>
                        <Input placeholder="Enter image URL" />
                    </Form.Item>
                    <Form.Item name="date_start" label="Start Date" rules={[{ required: true, message: "Please select start date" }]}>
                        <DatePicker style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item name="date_end" label="End Date" rules={[{ required: true, message: "Please select end date" }]}>
                        <DatePicker style={{ width: "100%" }} />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
                        {editRecruitment ? "Update Recruitment" : "Create Recruitment"}
                    </Button>
                </Form>

            </Modal>
        </div>
    );
};

export default RecruitmentManagement;
