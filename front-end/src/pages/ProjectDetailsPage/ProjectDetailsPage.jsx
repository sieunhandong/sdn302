import React, { useEffect, useState } from "react"; 
import { useParams, useNavigate } from "react-router-dom";
import { Modal, Table, Button, Spin, Tag, message } from "antd";
import * as ProjectService from "../../services/ProjectService";
import * as InternService from "../../services/InternService";
import * as CandidateService from "../../services/CandidateService";
import { useSelector } from "react-redux";

const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = useSelector((state) => state.user.access_token);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const projectRes = await ProjectService.getProjectByProductId(projectId, token);
        const internRes = await InternService.getInternsByProject(projectId, token);
        const candidateRes = await CandidateService.getCandidatesByProjectId(projectId, token);

        setProject(projectRes.data);
        setInterns(internRes.status === "SUCCESS" ? internRes.data : []);
        setCandidates(candidateRes.status === "SUCCESS" ? candidateRes.data : []);
      } catch (err) {
        console.error("Error fetching project details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId, token]);

  const handleAcceptCandidate = async (rollNumber) => {
    console.log("Accepting candidate:", rollNumber);
    try {
      const response = await CandidateService.acceptCandidate(projectId, rollNumber);
      if (response.status === "SUCCESS") {
        message.success("Candidate accepted as Intern!");

        setCandidates(prev => prev.filter(c => c.roll_number !== rollNumber));
        const newIntern = candidates.find(c => c.roll_number === rollNumber);
        if (newIntern) {
          setInterns(prev => [...prev, { ...newIntern, status: "Active" }]);
        }
      } else {
        message.error("Failed to accept candidate.");
      }
    } catch (err) {
      console.error("Error accepting candidate:", err);
      message.error("An error occurred while accepting candidate.");
    }
  };

  const handleRejectCandidate = (rollNumber) => {
    console.log("Rejecting candidate:", rollNumber);
    Modal.confirm({
      title: "Xác nhận từ chối ứng viên",
      content: "Bạn có chắc chắn muốn từ chối ứng viên này không?",
      okText: "Có",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          const response = await CandidateService.rejectCandidate(projectId, rollNumber);
          if (response.status === "SUCCESS") {
            message.warning("Candidate rejected.");
            setCandidates(prev => prev.filter(c => c.roll_number !== rollNumber));
          } else {
            message.error("Failed to reject candidate.");
          }
        } catch (err) {
          console.error("Error rejecting candidate:", err);
          message.error("An error occurred while rejecting candidate.");
        }
      },
    });
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "auto", padding: "20px" }}>
      {project && (
        <div style={{ display: "flex", marginBottom: "20px", alignItems: "center" }}>
          <img
            src={project.project_img || "/default_project.png"}
            alt="Project"
            style={{ width: "50%", borderRadius: "10px" }}
          />
          <div style={{ marginLeft: "20px", flex: 1 }}>
            <h1 style={{ fontSize: "26px", fontWeight: "bold" }}>{project.project_name}</h1>
            <p><b>Description:</b> {project.project_details}</p>
            <p><b>Start Date:</b> {new Date(project.project_start).toLocaleDateString()}</p>
            <p><b>End Date:</b> {new Date(project.project_end).toLocaleDateString()}</p>
            <p><b>Status:</b> <Tag color={project.status ? "green" : "red"}>{project.status ? "Active" : "Inactive"}</Tag></p>
          </div>
        </div>
      )}

      {/* Danh sách Candidates */}
      <h2 style={{ marginTop: "30px", fontSize: "22px", fontWeight: "bold" }}>Candidates Applying</h2>
      <Table
        columns={[
          { title: "Roll Number", dataIndex: "roll_number", key: "roll_number" },
          { title: "Full Name", dataIndex: "full_name", key: "full_name" },
          { title: "Avatar", dataIndex: "avatar", key: "avatar" },
          { title: "Specialization", dataIndex: ["applicant_id", "specialization"], key: "specialization", render: (specialization) => specialization || "N/A" },
          { title: "Position", dataIndex: "position_name", key: "position_name" },
          { title: "Date of Birth", dataIndex: "date_of_birth", key: "date_of_birth" },
          { title: "Gender", dataIndex: "gender", key: "gender" },
          { title: "Phone", dataIndex: "phone", key: "phone" },
          {
            title: "Actions",
            key: "actions",
            align: "center",
            render: (_, record) => (
              <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                <Button type="primary" onClick={() => handleAcceptCandidate(record.roll_number)}>Accept</Button>
                <Button type="default" danger onClick={() => handleRejectCandidate(record.roll_number)}>Reject</Button>
              </div>
            ),
          },
        ]}
        dataSource={candidates}
        rowKey="roll_number"
        pagination={{ pageSize: 5 }}
        bordered
      />

      {/* Danh sách Interns */}
      <h2 style={{ marginTop: "30px", fontSize: "22px", fontWeight: "bold" }}>Interns in Project</h2>
      <Table
        columns={[
          { title: "Roll Number", dataIndex: ["user_id", "roll_number"], key: "roll_number" },
          { title: "Full Name", dataIndex: "user_id", key: "full_name", render: (user) => `${user?.last_name} ${user?.first_name}` },
          { title: "Avatar", dataIndex: ["user_id", "avatar"], key: "avatar", render: (avatar) => <img src={avatar} alt="Avatar" style={{ width: "40px", height: "40px", borderRadius: "50%" }} /> },
          { title: "Position", dataIndex: ["position_id", "position_name"], key: "position" },
          { title: "Date of Birth", dataIndex: ["user_id", "date_of_birth"], key: "date_of_birth" },
          { title: "Gender", dataIndex: ["user_id", "gender"], key: "gender" },
          { title: "Phone", dataIndex: ["user_id", "phone"], key: "phone" },
          { title: "Active", dataIndex: ["user_id", "is_active"], key: "active", render: (active) => <Tag color={active ? "green" : "red"}>{active ? "Active" : "Inactive"}</Tag> },
        ]}
        dataSource={interns}
        rowKey="_id"
        pagination={{ pageSize: 5 }}
        bordered
      />

      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <Button type="primary" onClick={() => navigate(-1)} style={{ borderRadius: "8px", padding: "8px 20px" }}>Back</Button>
      </div>
    </div>
  );
};

export default ProjectDetail;
