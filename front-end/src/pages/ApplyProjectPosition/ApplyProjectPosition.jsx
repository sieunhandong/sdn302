import React, { useEffect, useState } from "react";
import { Button, Card } from "antd";
import * as ProjectService from "../../services/ProjectService";
import { useParams } from "react-router-dom";

const ApplyProjectPosition = () => {
  // const projectId = "67cf347237ea8282093a584c";
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await ProjectService.getDetailsProject(projectId);
        setProject(response.data);
      } catch (error) {
        console.error("Error fetching project details:", error);
      }
    };

    const fetchPositions = async () => {
      try {
        const response = await ProjectService.getProjectPositions(projectId);
        setPositions(response.data);
      } catch (error) {
        console.error("Error fetching positions:", error);
      }
    };

    fetchProjectDetails();
    fetchPositions();
  }, [projectId]);

  return (
    <div style={{ maxWidth: "1200px", margin: "auto", padding: "20px" }}>
      {project && (
        <div style={{ display: "flex", gap: "20px", marginBottom: "20px", alignItems: "stretch" }}>
          <Card style={{ flex: 1, padding: "0", borderRadius: "8px", overflow: "hidden" }}>
            <img src={project.project_img} alt="Project" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </Card>
          <Card style={{ flex: 1, padding: "20px", backgroundColor: "#f5f5f5", borderRadius: "8px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>{project.project_name}</h2>
            <p style={{ fontSize: "16px", margin: "5px 0" }}>
              Project Code: {project.project_code}
            </p>
            <p style={{ fontSize: "16px", margin: "5px 0" }}>
              Mentor ID: <a href="#" style={{ color: "#1677ff" }}>{project.mentor_id?.first_name} {project.mentor_id?.last_name}</a>
            </p>
            <p style={{ fontSize: "14px", color: "#555" }}>{project.project_details}</p>
          </Card>
        </div>
      )}
      <h3 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "10px" }}>Positions:</h3>
      <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
        {positions.length > 0 ? (
          positions.map((pos) => (
            <Card key={pos._id} style={{ width: "300px", padding: "15px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}>
              <p><strong>Position Code:</strong> {pos.position_code}</p>
              <p><strong>Position Name:</strong> {pos.position_name}</p>
              <p><strong>Position Count:</strong> {pos.position_count}</p>
              <Button type="primary" style={{ width: "100%", marginTop: "10px" }}>Apply</Button>
            </Card>
          ))
        ) : (
          <p>No positions available.</p>
        )}
      </div>
    </div>
  );
};

export default ApplyProjectPosition;