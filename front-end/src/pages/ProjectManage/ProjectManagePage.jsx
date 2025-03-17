import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as ProjectService from "../../services/ProjectService";
import { Table, Button, Modal, Form, Input, Select, DatePicker, message } from "antd";
import moment from "moment";
import { useSelector } from "react-redux";

const { Option } = Select;

const ProjectManagementPage = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [form] = Form.useForm();
    const token = useSelector((state) => state.user?.access_token);
    console.log('token', token)
    // Fetch projects từ API
    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await ProjectService.getAllProject();
            setProjects(response.data || []);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách project:", error);
        }
    };

    // Mở modal để thêm hoặc sửa project
    const showModal = (project = null) => {
        console.log("Dữ liệu project:", project); // Debug
        setEditingProject(project);
        form.setFieldsValue(
            project
                ? {
                    ...project,
                    mentor_id: project.mentor_id?._id || "", // Chỉ lấy ID
                    project_start: moment(project.project_start),
                    project_end: moment(project.project_end),
                    status: project.status ? "Active" : "Inactive"
                }
                : { project_name: "", mentor_id: "", project_img: "", project_details: "", project_start: null, project_end: null, status: "Active" }
        );
        setIsModalOpen(true);
    };

    // Xử lý submit form (thêm/sửa)
    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const formattedValues = {
                ...values,
                project_start: values.project_start ? values.project_start.format("YYYY-MM-DD") : null,
                project_end: values.project_end ? values.project_end.format("YYYY-MM-DD") : null,
                status: values.status === "Active" // Chuyển đổi thành Boolean
            };

            if (editingProject) {
                await ProjectService.updateProject(editingProject._id, formattedValues, token);
                message.success("Cập nhật dự án thành công!");
            } else {
                await ProjectService.createProject(formattedValues, token);
                message.success("Thêm dự án mới thành công!");
            }
            setIsModalOpen(false);
            fetchProjects(); // Cập nhật danh sách
        } catch (error) {
            console.error("Lỗi khi lưu dự án:", error);
            message.error("Có lỗi xảy ra!");
        }
    };


    // Xóa project
    // const handleDelete = async (id) => {
    //     Modal.confirm({
    //         title: "Bạn có chắc muốn xóa dự án này?",
    //         onOk: async () => {
    //             try {
    //                 await ProjectService.deleteProject(id);
    //                 message.success("Xóa dự án thành công!");
    //                 fetchProjects();
    //             } catch (error) {
    //                 console.error("Lỗi khi xóa dự án:", error);
    //                 message.error("Xóa thất bại!");
    //             }
    //         },
    //     });
    // };

    // Cột bảng
    const columns = [
        { title: "Tên Dự Án", dataIndex: "project_name", key: "project_name" },
        { title: "Mentor", dataIndex: "mentor_name", key: "mentor_name" },
        {
            title: "Ảnh",
            dataIndex: "project_img",
            key: "project_img",
            render: (src) => <img src={src} alt="Project" width={50} />
        },
        {
            title: "Chi tiết",
            dataIndex: "project_details",
            key: "project_details",
        },
        {
            title: "Ngày bắt đầu",
            dataIndex: "project_start",
            key: "project_start",
            render: (date) => moment(date).format("DD/MM/YYYY"), // Format ngày
        },
        {
            title: "Ngày kết thúc",
            dataIndex: "project_end",
            key: "project_end",
            render: (date) => moment(date).format("DD/MM/YYYY"),
        },
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
                    <Button type="primary" onClick={() => showModal(record)} style={{ marginRight: 10 }}>
                        Sửa
                    </Button>
                    {/* <Button type="danger" onClick={() => handleDelete(record._id)}>
                        Xóa
                    </Button> */}
                </>
            ),
        }
    ];


    return (
        <div style={{ padding: 20 }}>
            <h1>Quản lý dự án</h1>
            <Button type="primary" onClick={() => showModal()} style={{ marginBottom: 20 }}>
                Thêm mới
            </Button>
            <Table dataSource={projects} columns={columns} rowKey="_id" />

            {/* Modal Thêm/Sửa */}
            <Modal title={editingProject ? "Chỉnh sửa dự án" : "Thêm dự án"} open={isModalOpen} onOk={handleOk} onCancel={() => setIsModalOpen(false)}>
                <Form form={form} layout="vertical">
                    <Form.Item name="project_name" label="Tên Dự Án" rules={[{ required: true, message: "Vui lòng nhập tên dự án!" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="mentor_id" label="Mentor">
                        <Input />
                    </Form.Item>
                    <Form.Item name="project_img" label="Ảnh Dự Án">
                        <Input />
                    </Form.Item>
                    <Form.Item name="project_details" label="Chi tiết">
                        <Input.TextArea rows={3} />
                    </Form.Item>
                    <Form.Item name="project_start" label="Ngày bắt đầu">
                        <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item name="project_end" label="Ngày kết thúc">
                        <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item name="status" label="Trạng thái">
                        <Select>
                            <Option value="Active">Active</Option>
                            <Option value="Inactive">Inactive</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ProjectManagementPage;
