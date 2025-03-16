import React, { useEffect, useState } from "react"; 
import { Table, Input, Button, Tag } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import * as MentorService from "../../services/MentorService";
import { useNavigate } from "react-router-dom";

const UserInformation = () => {
  const [mentors, setMentors] = useState([]);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMentorDetails = async () => {
      try {
        const response = await MentorService.getMentorInfo();
        setMentors(response.data);
      } catch (error) {
        console.error("Error fetching mentor details:", error);
      }
    };

    fetchMentorDetails();
  }, []);

  const columns = [
    {
      title: "Mentor ID",
      dataIndex: "mentor_id",
      key: "mentor_id",
      width: 100,
      align: "center",
    },
    {
      title: "Full Name",
      dataIndex: "full_name",
      key: "full_name",
      width: 180,
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      width: 80,
      align: "center",
      render: (avatar) =>
        avatar ? (
          <img
            src={avatar}
            alt="Avatar"
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              border: "2px solid #ddd",
              objectFit: "cover",
            }}
          />
        ) : (
          "No Avatar"
        ),
    },
    {
      title: "Date of Birth",
      dataIndex: "date_of_birth",
      key: "dob",
      width: 120,
      render: (date) => new Date(date).toISOString().split("T")[0],
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      width: 100,
      align: "center",
      render: (gender) => (gender === "MALE" ? "Male" : "Female"),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      width: 140,
    },
    {
      title: "Active",
      dataIndex: "active",
      key: "active",
      width: 100,
      align: "center",
      render: (active) => (
        <Tag color={active ? "green" : "red"}>
          {active ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Projects Name",
      dataIndex: "projects",
      key: "projects",
      width: 250,
      render: (projects) =>
        projects.length > 0 ? (
          projects.map((project, index) => (
            <div key={index}>
              <a
                onClick={() => navigate(`/get-interns-by-project/${project.project_id}`)}
                style={{ color: "#1677ff", textDecoration: "none" }}
                onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
                onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
              >
                {project.project_name}
              </a>
            </div>
          ))
        ) : (
          <Tag color="gray">No Projects</Tag>
        ),
    },
    {
      title: "Project Time",
      dataIndex: "projects",
      key: "project_time",
      width: 220,
      render: (projects) =>
        projects.length > 0 ? (
          projects.map((project, index) => (
            <div key={index} style={{ marginBottom: "5px" }}>
              <Tag color="geekblue">Candidate Apply</Tag>{" "}
              {new Date(project.project_start).toISOString().split("T")[0]} -{" "}
              {new Date(project.project_end).toISOString().split("T")[0]}
            </div>
          ))
        ) : (
          "N/A"
        ),
    },
  ];

  const filteredMentors = mentors.filter((mentor) =>
    mentor.full_name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div style={{ maxWidth: "95%", margin: "auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center", fontSize: "26px", fontWeight: "bold" }}>
        User Information
      </h1>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
        <Input
          placeholder="Search By Name Mentor"
          style={{
            width: "300px",
            marginRight: "10px",
            borderRadius: "8px",
          }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Button type="primary" icon={<SearchOutlined />} style={{ borderRadius: "8px" }}>
          Search
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredMentors}
        rowKey="mentor_id"
        pagination={{ pageSize: 5 }}
        bordered
        style={{
          backgroundColor: "white",
          borderRadius: "10px",
          overflow: "hidden",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      />
    </div>
  );
};

export default UserInformation;
