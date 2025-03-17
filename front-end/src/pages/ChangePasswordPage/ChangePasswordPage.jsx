import React, { useState } from "react";
import { Form, Input, Button, message, Card, Spin, Alert } from "antd";
import { useNavigate } from "react-router-dom";
import * as UserService from "../../services/UserService"; 

const ChangePasswordPage = () => {
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(""); // State lưu lỗi từ API
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const handleSubmit = async (values) => {
        setLoading(true);
        setErrorMessage(""); // Reset lỗi trước khi gửi yêu cầu mới
        try {
            const response = await UserService.changePassword(values);
            console.log("Response from API:", response);

            if (response.status === "OK") {
                message.success("Password updated successfully!");
                navigate("/profile"); 
            } else {
                setErrorMessage(response.message); // Hiển thị lỗi từ API lên giao diện
            }
        } catch (error) {
            // console.error("Error in handleSubmit:", error); // Log lỗi để debug

            // Nếu API trả về response, lấy lỗi từ response
            if (error.response) {
                console.log("Error response from API:", error.response);
                setErrorMessage(error.response.data.message || "Something went wrong!");
            } else if (error.request) {
                // Request đã được gửi nhưng không có phản hồi từ server
                // console.log("No response received:", error.request);
                setErrorMessage("No response from server! Please try again.");
            } else {
                // Một lỗi khác xảy ra
                // console.log("Unexpected error:", error.message);
                setErrorMessage("Failed to update password! Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };


    return (
        <div style={{ display: "flex", justifyContent: "center", marginTop: 50 }}>
            <Card title="Change Password" style={{ width: 400 }}>
                <Spin spinning={loading}>
                    {errorMessage && <Alert message={errorMessage} type="error" showIcon style={{ marginBottom: 10 }} />}

                    <Form form={form} layout="vertical" onFinish={handleSubmit}>
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[{ required: true, message: "Please enter your email" }]}
                        >
                            <Input placeholder="Enter your email" />
                        </Form.Item>

                        <Form.Item
                            name="oldPassword"
                            label="Old Password"
                            rules={[{ required: true, message: "Please enter old password" }]}
                        >
                            <Input.Password placeholder="Enter old password" />
                        </Form.Item>

                        <Form.Item
                            name="newPassword"
                            label="New Password"
                            rules={[{ required: true, message: "Please enter new password" }]}
                        >
                            <Input.Password placeholder="Enter new password" />
                        </Form.Item>

                        <Form.Item
                            name="confirmPassword"
                            label="Confirm New Password"
                            dependencies={["newPassword"]}
                            rules={[
                                { required: true, message: "Please confirm new password" },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue("newPassword") === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error("Passwords do not match!"));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password placeholder="Confirm new password" />
                        </Form.Item>

                        <Button type="primary" htmlType="submit" block>
                            Change Password
                        </Button>
                    </Form>
                </Spin>
            </Card>
        </div>
    );
};

export default ChangePasswordPage;
