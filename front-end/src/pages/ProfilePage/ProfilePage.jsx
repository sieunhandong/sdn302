import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Avatar, Button, Card, Form, Input, message, Upload, Radio, DatePicker, Spin } from "antd";
import { UploadOutlined, EditOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";
import moment from "moment";
import * as UserService from "../../services/UserService";
import { useSelector } from "react-redux";
import { useDispatch } from 'react-redux';
import { updateUser } from "../../redux/slides/userSlide";

const ProfilePage = () => {
    const id = useSelector((state) => state.user.id)
    const token = localStorage.getItem("access_token"); // Lấy token
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const dispatch = useDispatch();

    // Gọi API khi mở trang
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await UserService.getDetailsUser(id, token);
                console.log("data", data)
                setUser(data.data);

                form.setFieldsValue({
                    ...data,
                    date_of_birth: data.date_of_birth ? moment(data.date_of_birth) : null,
                });
            } catch (error) {
                message.error("Lỗi khi tải dữ liệu!");
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [id, token, form]);;

    // Xử lý khi nhấn "Lưu thay đổi"
    const handleSave = async (values) => {
        try {
            setSaving(true);
            // Chuyển đổi date_of_birth từ Moment object sang chuỗi YYYY-MM-DD
            const updatedUser = {
                ...user,
                ...values,
                date_of_birth: values.date_of_birth ? values.date_of_birth.format("YYYY-MM-DD") : null,
            };
            console.log("update", updatedUser)
            await UserService.updateUser(id, updatedUser);
            dispatch(updateUser({ ...user, access_token: token }));
            setUser(updatedUser);
            message.success("Updated information successfully!!");
            setIsEditing(false);
        } catch (error) {
            message.error("Updated failded!");
        } finally {
            setSaving(false);
        }
    };

    // Khi nhấn "Hủy"
    const handleCancel = () => {
        setIsEditing(false);
        form.setFieldsValue({
            ...user,
            date_of_birth: user?.date_of_birth ? moment(user.date_of_birth) : null,
        });
    };
    if (loading) return <Spin size="large" style={{ display: "block", margin: "50px auto" }} />;

    return (
        <div style={{ display: "flex", justifyContent: "center", marginTop: 50 }}>
            <Card title="Personal information" style={{ width: 450, textAlign: "center" }}>
                <Avatar src={user?.avatar || "https://st.quantrimang.com/photos/image/072015/22/avatar.jpg"} size={100} />
                {/* {isEditing && (
                    <Upload name="avatar" showUploadList={false} onChange={handleUpload}>
                        <Button icon={<UploadOutlined />} style={{ marginTop: 10 }}>
                            Change profile avatar
                        </Button>
                    </Upload>
                )} */}

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSave}
                    initialValues={user}
                    style={{ marginTop: 20 }}
                >
                    <Form.Item name="roll_number" label="Roll Number">
                        <div>{user?.roll_number || "Not updated yet"}</div>

                    </Form.Item>
                    <Form.Item name="first_name" label="First name">
                        {isEditing ? <Input /> : <div>{user?.first_name || "Not updated yet"}</div>}
                    </Form.Item>
                    <Form.Item name="last_name" label="Last Name">
                        {isEditing ? <Input /> : <div>{user?.last_name || "Not updated yet"}</div>}
                    </Form.Item>
                    <Form.Item name="gender" label="Gender">
                        {isEditing ? (
                            <Radio.Group>
                                <Radio value="MALE">MALE</Radio>
                                <Radio value="FEMALE">FEMALE</Radio>
                                <Radio value="OTHER">OTHER</Radio>
                            </Radio.Group>
                        ) : (
                            <div>{user?.gender === "MALE" ? "MALE" : user?.gender === "FEMALE" ? "FEMALE" : "OTHER"}</div>
                        )}
                    </Form.Item>
                    <Form.Item name="date_of_birth" label="Date Of Birth">
                        {isEditing ? (
                            <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
                        ) : (
                            <div>{user?.date_of_birth ? moment(user.date_of_birth).format("DD/MM/YYYY") : "Not updated yet"}</div>
                        )}
                    </Form.Item>

                    <Form.Item name="email" label="Email">
                        <div>{user?.email || "Not updated yet"}</div>
                    </Form.Item>
                    <Form.Item name="role" label="Role">
                        <div>{user?.role || "Not updated yet"}</div>
                    </Form.Item>
                    <Form.Item name="phone" label="Phone Number">
                        {isEditing ? <Input /> : <div>{user?.phone || "Not updated yet"}</div>}
                    </Form.Item>
                    <Form.Item name="specialization" label="Specialization">
                        {isEditing ? <Input /> : <div>{user?.specialization || "Not updated yet"}</div>}
                    </Form.Item>

                    {isEditing ? (
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <Button type="primary" htmlType="submit" loading={saving} icon={<SaveOutlined />}>
                                Save changes
                            </Button>
                            <Button onClick={handleCancel} icon={<CloseOutlined />}>
                                Cancel
                            </Button>
                        </div>
                    ) : (
                        <Button type="default" onClick={() => setIsEditing(true)} icon={<EditOutlined />}>
                            Edit
                        </Button>
                    )}
                </Form>
            </Card>
        </div>
    );
};

export default ProfilePage;
