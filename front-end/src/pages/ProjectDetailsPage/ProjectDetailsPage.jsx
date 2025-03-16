import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Table, Button, Spin, Tag, message } from "antd";
import * as ProjectService from "../../services/ProjectService";
import * as InternService from "../../services/InternService";
import * as CandidateService from "../../services/CandidateService";

const ProjectDetail = () => {
  const { id: projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const projectRes = await ProjectService.getProjectByUserId(projectId);
        const internRes = await InternService.getInternsByProject(projectId);
        const candidateRes = await CandidateService.getCandidatesByProjectId(projectId);

        console.log("Project Response:", projectRes);
      console.log("Intern Response:", internRes);
      console.log("Candidate Response:", candidateRes);

        setProject(projectRes.status === "SUCCESS" ? projectRes.data : null);
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

  const handleAcceptCandidate = async (candidateId) => {
    try {
      const response = await CandidateService.acceptCandidate(projectId, candidateId);
      if (response.status === "SUCCESS") {
        message.success("Candidate accepted as Intern!");
        setCandidates(candidates.filter((c) => c._id !== candidateId));
        setInterns([...interns, candidates.find((c) => c._id === candidateId)]);
      } else {
        message.error("Failed to accept candidate.");
      }
    } catch (err) {
      console.error("Error accepting candidate:", err);
      message.error("An error occurred while accepting candidate.");
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <Spin size="large" />
      </div>
    );
  }

  const candidateColumns = [
    {
      title: "Candidate ID",
      dataIndex: "_id",
      key: "candidate_id",
      align: "center",
      width: 120,
    },
    {
      title: "Full Name",
      dataIndex: "applicant_id",
      key: "full_name",
      render: (user) => `${user.first_name} ${user.last_name}`,
    },
    {
      title: "Specialization",
      dataIndex: ["applicant_id", "specialization"],
      key: "specialization",
    },
    {
      title: "Avatar",
      dataIndex: ["applicant_id", "avatar"],
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
      title: "Accept",
      key: "accept",
      align: "center",
      render: (_, record) => (
        <Button type="primary" onClick={() => handleAcceptCandidate(record.applicant_id._id)}>
          Accept
        </Button>
      ),
    },
  ];

  const internColumns = [
    {
      title: "Intern ID",
      dataIndex: "_id",
      key: "_id",
      align: "center",
      width: 100,
    },
    {
      title: "Full Name",
      dataIndex: "user_id",
      key: "full_name",
      render: (user_id) => `${user_id.first_name} ${user_id.last_name}`,
    },
    {
      title: "Position",
      dataIndex: ["position_id", "position_name"],
      key: "position",
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
      title: "Active",
      dataIndex: ["user_id", "is_active"],
      key: "active",
      align: "center",
      render: (active) => <Tag color={active ? "green" : "red"}>{active ? "Active" : "Inactive"}</Tag>,
    },
  ];

  return (
    <div style={{ maxWidth: "1200px", margin: "auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center", fontSize: "26px", fontWeight: "bold" }}>Project Details</h1>

      {project && (
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "#333" }}>
            Project: {project.project_name}
          </h2>
          <h2 style={{ fontSize: "18px", color: "#555" }}>
            Mentor: {project.mentor_id.first_name} {project.mentor_id.last_name}
          </h2>
        </div>
      )}

      <h2 style={{ marginTop: "30px", fontSize: "22px", fontWeight: "bold" }}>Application Project Position</h2>
      <Table
        columns={candidateColumns}
        dataSource={candidates}
        rowKey="_id"
        pagination={{ pageSize: 5 }}
        bordered
        style={{ backgroundColor: "white", borderRadius: "10px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}
      />

      <h2 style={{ marginTop: "30px", fontSize: "22px", fontWeight: "bold" }}>Interns in Project</h2>
      <Table
        columns={internColumns}
        dataSource={interns}
        rowKey="_id"
        pagination={{ pageSize: 5 }}
        bordered
        style={{ backgroundColor: "white", borderRadius: "10px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}
      />

      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <Button type="primary" onClick={() => navigate(-1)} style={{ borderRadius: "8px", padding: "8px 20px" }}>
          Back
        </Button>
      </div>
    </div>
  );
};

export default ProjectDetail;
