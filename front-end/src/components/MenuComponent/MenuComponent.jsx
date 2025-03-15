import React from "react";
import { Link } from "react-router-dom";
import { Drawer } from "antd";
import {
    HomeOutlined,
    ShoppingCartOutlined,
    UserOutlined,
    LockOutlined,
    CloseOutlined,
    TeamOutlined,
    FileTextOutlined,
    SettingOutlined
} from "@ant-design/icons";

// Định nghĩa menu theo từng vai trò với đường dẫn rõ ràng
const menuByRole = {
    ADMIN: [
        { title: "Home", path: "/", icon: <HomeOutlined /> },
        { title: "Manage Users", path: "/users-management", icon: <TeamOutlined /> },
        { title: "Manage Recruitment", path: "/manage-recruitment", icon: <FileTextOutlined /> },
        { title: "Settings", path: "/settings", icon: <SettingOutlined /> },
    ],
    MENTOR: [
        { title: "Home", path: "/", icon: <HomeOutlined /> },
        { title: "My Project", path: "/my-project", icon: <TeamOutlined /> },
        { title: "Report Management", path: "/report-management", icon: <LockOutlined /> },
        { title: "Message Management", path: "/message-management", icon: <LockOutlined /> },
        { title: "Attendance Management", path: "/attendance-management", icon: <LockOutlined /> },
        { title: "Recruitment Management", path: "/recruitment-management-mentor", icon: <LockOutlined /> },
    ],
    CANDIDATE: [
        { title: "Home", path: "/", icon: <HomeOutlined /> },
        { title: "Addresses", path: "/addresses", icon: <UserOutlined /> },
        { title: "Change Password", path: "/change-password", icon: <LockOutlined /> },
    ],
    INTERN: [
        { title: "Home", path: "/", icon: <HomeOutlined /> },
        { title: "My Project", path: "/my-project-intern", icon: <HomeOutlined /> },
        { title: "Report Management", path: "/report-management", icon: <FileTextOutlined /> },
        { title: "Schedule", path: "/schedule", icon: <FileTextOutlined /> },
        { title: "Attendance", path: "/attendance", icon: <FileTextOutlined /> },
        { title: "Mark Report", path: "/attendance", icon: <FileTextOutlined /> },
    ],
    HR: [
        { title: "Home", path: "/", icon: <HomeOutlined /> },
        { title: "Recruitment Management", path: "/recruitment-management-hr", icon: <FileTextOutlined /> },
        { title: "Project Management", path: "/project-management", icon: <LockOutlined /> },
        { title: "Interview Schedule Management", path: "/schedule-management", icon: <LockOutlined /> },
    ],
};

const MenuComponent = ({ isOpen, onClose, role }) => {
    // Lấy danh sách menu theo role, nếu không có thì trả về mảng rỗng []
    const navigations = menuByRole[role] || [];

    return (
        <Drawer title="Menu" placement="left" onClose={onClose} open={isOpen} closeIcon={<CloseOutlined />}>
            <nav style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {navigations.map(({ title, path, icon }) => (
                    <Link
                        key={title}
                        to={path} // Đã đảm bảo mỗi mục đều có path
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            padding: "10px",
                            fontSize: "16px",
                            color: "#333",
                            textDecoration: "none",
                            borderRadius: "5px",
                            transition: "background 0.3s",
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.background = "#f0f0f0")}
                        onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                        {icon} <span>{title}</span>
                    </Link>
                ))}
            </nav>
        </Drawer>
    );
};

export default MenuComponent;
