import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Table, Button, Spin, Tag } from "antd";
import * as InternService from "../../services/InternService";

const InternOfProject = () => {
  const { projectId } = useParams();
//   const projectId = "67cf364653b15a4b4a1e229d";
  const navigate = useNavigate();
  const [projectData, setProjectData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInternsByProject = async () => {
      try {
        const response = await InternService.getInternsByProject(projectId);
        setProjectData(response.status === "SUCCESS" ? response.data : []);
      } catch (err) {
        console.error("Error fetching interns:", err);
        setProjectData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInternsByProject();
  }, [projectId]);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <Spin size="large" />
      </div>
    );
  }

  const columns = [
    {
      title: "Intern ID",
      dataIndex: "_id",
      key: "intern_id",
      align: "center",
      width: 100,
    },
    {
      title: "User ID",
      dataIndex: ["user_id", "roll_number"],
      key: "user_id",
      align: "center",
      width: 120,
    },
    {
      title: "Full Name",
      dataIndex: "user_id",
      key: "full_name",
      render: (user) => `${user.first_name} ${user.last_name}`,
    },
    {
      title: "Specialization",
      dataIndex: ["user_id", "specialization"],
      key: "specialization",
    },
    {
      title: "Position",
      dataIndex: ["position_id", "position_name"],
      key: "position",
      render: (position) => position || "N/A",
    },
    {
      title: "Avatar",
      dataIndex: ["user_id", "avatar"],
      key: "avatar",
      align: "center",
      render: (avatar) => (
        <img
          src={avatar || "/default_avatar.png"}
          alt="Avatar"
          style={{ width: 40, height: 40, borderRadius: "50%" }}
        />
      ),
    },
    {
      title: "Date of Birth",
      dataIndex: ["user_id", "date_of_birth"],
      key: "dob",
      render: (date) => new Date(date).toISOString().split("T")[0],
    },
    {
      title: "Gender",
      dataIndex: ["user_id", "gender"],
      key: "gender",
      align: "center",
      width: 100,
    },
    {
      title: "Phone",
      dataIndex: ["user_id", "phone"],
      key: "phone",
    },
    {
      title: "Active",
      dataIndex: ["user_id", "is_active"],
      key: "active",
      align: "center",
      width: 100,
      render: (active) => <Tag color={active ? "green" : "red"}>{active ? "Active" : "Inactive"}</Tag>,
    },
  ];

  return (
    <div style={{ maxWidth: "1200px", margin: "auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center", fontSize: "26px", fontWeight: "bold" }}>Interns in Project</h1>

      {/* Hiển thị thông tin Project & Mentor */}
      {projectData.length > 0 && (
        <div style={{ marginBottom: "20px", textAlign: "center" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "#333" }}>
            Project: {projectData[0].project_id.project_name}
          </h2>
          <h2 style={{ fontSize: "18px", color: "#555" }}>
            Mentor: {projectData[0].mentor_id.first_name} {projectData[0].mentor_id.last_name}
          </h2>
        </div>
      )}

      {/* Bảng hiển thị danh sách thực tập sinh */}
      <Table
        columns={columns}
        dataSource={projectData}
        rowKey="_id"
        pagination={{ pageSize: 5 }}
        bordered
        style={{
          backgroundColor: "white",
          borderRadius: "10px",
          overflow: "hidden",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      />

      {/* Nút Back */}
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <Button
          type="primary"
          onClick={() => navigate(-1)}
          style={{
            backgroundColor: "#1677ff",
            borderRadius: "8px",
            padding: "8px 20px",
          }}
        >
          Back
        </Button>
      </div>
    </div>
  );
};

export default InternOfProject;
