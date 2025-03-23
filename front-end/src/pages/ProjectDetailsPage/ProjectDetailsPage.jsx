import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Table, Button, Spin, Tag, message } from "antd";
import * as ProjectService from "../../services/ProjectService";
import * as InternService from "../../services/InternService";
import * as CandidateService from "../../services/CandidateService";
import { useSelector } from "react-redux";

const ProjectDetail = () => {
  const { projectId } = useParams();
  console.log("projectId", projectId)
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
        let candidateRes;

        try {
          candidateRes = await CandidateService.getCandidatesByProjectId(projectId, token);
        } catch (err) {
          candidateRes = { status: "SUCCESS", data: [] }; // Nếu API lỗi, gán mảng rỗng
        }

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
  }, [projectId]);


  const handleAcceptCandidate = async (id) => {
    try {
      const response = await CandidateService.acceptCandidate(projectId, id, token);
      if (response.status === "SUCCESS") {
        message.success("Candidate accepted as Intern!");
        setCandidates(candidates.filter((c) => c._id !== id));
        setInterns([...interns, candidates.find((c) => c._id === id)]);
      } else {
        message.error("Failed to accept candidate.");
      }
    } catch (err) {
      console.error("Error accepting candidate:", err);
      message.error("An error occurred while accepting candidate.");
    }
  };
  const handleRejectCandidate = async (id) => {
    try {
      const response = await CandidateService.rejectCandidate(projectId, id, token);
      if (response.status === "SUCCESS") {
        message.success("Candidate has been rejected!");
        setCandidates(candidates.filter((c) => c._id !== id));
      } else {
        message.error("Failed to reject candidate.");
      }
    } catch (err) {
      console.error("Error rejecting candidate:", err);
      message.error("An error occurred while rejecting the candidate.");
    }
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
      {/* Hàng 1: Ảnh dự án + Thông tin dự án */}
      {project && (
        <div style={{ display: "flex", marginBottom: "20px", alignItems: "center" }}>
          <img
            src={project.project_img || "/default_project.png"}
            alt="Project"
            style={{ width: "50%", borderRadius: "10px" }}
          />
          <div style={{ marginLeft: "20px", flex: 1 }}>
            <h1 style={{ fontSize: "26px", fontWeight: "bold" }}>{project.project_name}</h1>
            <p><b>Mentor:</b> {project.mentor_id?.last_name} {project.mentor_id?.first_name}</p>
            <p><b>Start Date:</b> {new Date(project.project_start).toLocaleDateString()}</p>
            <p><b>End Date:</b> {new Date(project.project_end).toLocaleDateString()}</p>
            <p><b>Status:</b> <Tag color={project.status ? "green" : "red"}>{project.status ? "Active" : "Inactive"}</Tag></p>
          </div>
        </div>
      )}

      {/* Hàng 2: Danh sách Candidates */}
      <h2 style={{ marginTop: "30px", fontSize: "22px", fontWeight: "bold" }}>Candidates Applying</h2>
      {candidates.length > 0 ? (
        <Table
          columns={[
            { title: "Full Name", dataIndex: "full_name", key: "full_name" },
            { title: "Roll Number", dataIndex: "roll_number", key: "roll_number" },
            { title: "Gender", dataIndex: "gender", key: "gender" },
            { title: "Specialization", dataIndex: "specialization", key: "specialization" },
            {
              title: "Actions",
              key: "actions",
              align: "center",
              render: (_, record) => (
                <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                  <Button type="primary" onClick={() => handleAcceptCandidate(record._id)}>Accept</Button>
                  <Button type="primary" danger onClick={() => handleRejectCandidate(record._id)}>Reject</Button>
                </div>
              ),
            },
          ]}
          dataSource={candidates}
          rowKey="_id"
          pagination={{ pageSize: 5 }}
          bordered
        />
      ) : (
        <p style={{ textAlign: "center", fontStyle: "italic", color: "gray" }}>No candidates applied yet.</p>
      )}


      {/* Hàng 3: Danh sách Interns */}
      <h2 style={{ marginTop: "30px", fontSize: "22px", fontWeight: "bold" }}>Interns in Project</h2>
      <Table
        columns={[
          { title: "Full Name", dataIndex: "user_id", key: "full_name", render: (user) => `${user?.last_name} ${user?.first_name}` },
          { title: "Position", dataIndex: ["position_id", "position_name"], key: "position" },
          { title: "Active", dataIndex: ["user_id", "is_active"], key: "active", render: (active) => <Tag color={active ? "green" : "red"}>{active ? "Active" : "Inactive"}</Tag> },
        ]}
        dataSource={interns || []}
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
