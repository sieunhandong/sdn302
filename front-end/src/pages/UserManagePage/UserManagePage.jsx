import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Table, Button, Modal, Form, Input, Select, DatePicker, message, Popconfirm, Alert } from "antd";
import * as UserService from "../../services/UserService";
import moment from "moment";

const { Option } = Select;

const UserManagementPage = () => {
    const [users, setUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [form] = Form.useForm();
    const token = useSelector((state) => state.user?.access_token);
    const [errorMessage, setErrorMessage] = useState("");

    // Lấy danh sách người dùng
    useEffect(() => {
        fetchUsers();
    }, []);
    console.log('token-get-all', token)
    const fetchUsers = async () => {
        try {
            const response = await UserService.getAllUsers(token);
            setUsers(response.data.data || []);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách người dùng:", error);
            message.error("Không thể lấy danh sách người dùng!");
        }
    };

    // Mở modal để chỉnh sửa hoặc thêm người dùng
    const showModal = (user = null) => {
        setEditingUser(user);
        form.setFieldsValue(
            user
                ? {
                    ...user,
                    date_of_birth: user.date_of_birth ? moment(user.date_of_birth) : null
                }
                : { first_name: "", last_name: "", email: "", password: "", phone: "", role: "CANDIDATE", gender: "OTHER", date_of_birth: null, is_active: true }
        );
        setIsModalOpen(true);
    };

    // Xử lý cập nhật hoặc thêm mới người dùng
    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const formattedValues = {
                ...values,
                date_of_birth: values.date_of_birth ? values.date_of_birth.format("YYYY-MM-DD") : null
            };

            let response;
            if (editingUser) {
                response = await UserService.updateUser(editingUser._id, formattedValues, token);
            } else {
                response = await UserService.createUser(formattedValues, token);
            }

            console.log("API Response:", response);

            if (response.status === "ERR") {
                // Hiển thị lỗi ở trên cùng của Modal
                form.setFields([
                    {
                        name: "email", // Nếu lỗi liên quan đến email, đổi field này nếu cần
                        errors: [response.message],
                    },
                ]);
                return;
            }

            message.success(editingUser ? "Cập nhật thành công!" : "Thêm người dùng thành công!");
            setIsModalOpen(false);
            fetchUsers();
        } catch (error) {
            console.error("Chi tiết lỗi từ API:", error.response);

            if (error.response?.data?.message) {
                // Hiển thị lỗi trên modal
                form.setFields([
                    {
                        name: "email", // Chỉnh lại nếu lỗi không phải từ email
                        errors: [error.response.data.message],
                    },
                ]);
            } else {
                message.error("Có lỗi xảy ra, vui lòng thử lại!");
            }
        }
    };



    // Xóa người dùng
    const handleDeleteUser = async (id) => {
        try {
            await UserService.deleteUser(id, token);
            message.success("Xóa người dùng thành công!");
            fetchUsers();
        } catch (error) {
            console.error("Lỗi khi xóa người dùng:", error);
            message.error("Xóa thất bại!");
        }
    };

    // Cột của bảng
    const columns = [
        { title: "Roll Number", dataIndex: "roll_number", key: "roll_number" },
        { title: "First Name", dataIndex: "first_name", key: "first_name" },
        { title: "Last Name", dataIndex: "last_name", key: "last_name" },
        { title: "Email", dataIndex: "email", key: "email" },
        { title: "Phone Number", dataIndex: "phone", key: "phone" },
        {
            title: "Gender",
            dataIndex: "gender",
            key: "gender",
            render: (gender) => (
                <span>
                    {gender === "MALE" ? "MALE" : gender === "FEMALE" ? "FEMALE" : "OTHER"}
                </span>
            ),
        },
        {
            title: "Date Of Birth",
            dataIndex: "date_of_birth",
            key: "date_of_birth",
            render: (date) => (date ? moment(date).format("DD/MM/YYYY") : "N/A"),
        },
        { title: "Specialization", dataIndex: "specialization", key: "specialization" },
        {
            title: "Role",
            dataIndex: "role",
            key: "role",
            render: (role) => <strong>{role}</strong>,
        },
        {
            title: "Active",
            dataIndex: "is_active",
            key: "is_active",
            render: (isActive) => (
                <span style={{ color: isActive ? "green" : "red", fontWeight: "bold" }}>
                    {isActive ? "Active" : "InActive"}
                </span>
            ),
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <>
                    <Button type="primary" onClick={() => showModal(record)} style={{ marginRight: 10 }}>
                        Edit
                    </Button>
                    <Popconfirm title="Bạn có chắc chắn xóa?" onConfirm={() => handleDeleteUser(record._id)}>
                        <Button danger>Delete</Button>
                    </Popconfirm>
                </>
            ),
        },
    ];

    return (
        <div style={{ padding: 20 }}>
            <h1>Users Management</h1>
            <Button type="primary" onClick={() => showModal()} style={{ marginBottom: 20 }}>
                Add User
            </Button>
            {/* {errorMessage && <Alert message={errorMessage} type="error" showIcon style={{ marginBottom: 10 }} />} */}
            <Table dataSource={users} columns={columns} rowKey="_id" />

            {/* Modal Chỉnh sửa hoặc thêm người dùng */}
            <Modal title={editingUser ? "Chỉnh sửa người dùng" : "Thêm người dùng"} open={isModalOpen} onOk={handleOk} onCancel={() => setIsModalOpen(false)}>
                <Form form={form} layout="vertical">
                    {editingUser && (
                        <Form.Item name="roll_number" label="Roll Number">
                            <Input disabled />
                        </Form.Item>
                    )}
                    <Form.Item name="first_name" label="First Name" rules={[{ required: true, message: "Vui lòng nhập First Name!" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="last_name" label="Last Name" rules={[{ required: true, message: "Vui lòng nhập Last Name!" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ required: true, message: "Vui lòng nhập Email!" }]}>
                        <Input disabled={!!editingUser} />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="Password"
                        rules={!editingUser ? [{ required: true, message: "Vui lòng nhập mật khẩu!" }] : []}
                        hidden={!!editingUser} // Ẩn khi chỉnh sửa user
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        name="confirm_password"
                        label="Confirm Password"
                        dependencies={['password']}
                        hasFeedback
                        rules={
                            !editingUser
                                ? [
                                    { required: true, message: "Vui lòng nhập lại mật khẩu!" },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error("Mật khẩu không khớp!"));
                                        },
                                    }),
                                ]
                                : []
                        }
                        hidden={!!editingUser} // Ẩn khi chỉnh sửa user
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item name="phone" label="Phone Number">
                        <Input />
                    </Form.Item>
                    <Form.Item name="gender" label="Gender">
                        <Select>
                            <Option value="MALE">Male</Option>
                            <Option value="FEMALE">Female</Option>
                            <Option value="OTHER">Other</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="date_of_birth" label="Date Of Birth">
                        <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item name="specialization" label="Specialization">
                        <Input />
                    </Form.Item>
                    <Form.Item name="role" label="Role">
                        <Select>
                            <Option value="ADMIN">ADMIN</Option>
                            <Option value="MENTOR">MENTOR</Option>
                            <Option value="CANDIDATE">CANDIDATE</Option>
                            <Option value="INTERN">INTERN</Option>
                            <Option value="HR">HR</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="is_active" label="Active" hidden={!editingUser}>
                        <Select>
                            <Option value={true}>Active</Option>
                            <Option value={false}>InActive</Option>
                        </Select>
                    </Form.Item>

                </Form>
            </Modal>
        </div>
    );
};

export default UserManagementPage;
