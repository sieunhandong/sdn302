import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllReports } from "../../services/ReportService";
import { getDetailsUser } from "../../services/UserService";
import styles from "./style"; 

const InternReports = () => {
    const [reports, setReports] = useState([]);
    const [selectedProject, setSelectedProject] = useState("All Projects");
    const navigate = useNavigate(); 

    useEffect(() => {
        async function fetchReports() {
            const response = await getAllReports();
            if (response.status === "OK") {
                const reportsData = response.data;

                const userIds = [...new Set(reportsData.map(report => report.intern_id?.user_id))];

                const userDetailsPromises = userIds.map(id => getDetailsUser(id));
                const userDetailsResponses = await Promise.all(userDetailsPromises);
                
                const userMap = {};
                userDetailsResponses.forEach((res, index) => {
                    if (res.status === "OK") {
                        userMap[userIds[index]] = res.data;
                    }
                });

                const updatedReports = reportsData.map(report => ({
                    ...report,
                    intern_name: userMap[report.intern_id?.user_id]?.first_name + " " + userMap[report.intern_id?.user_id]?.last_name,
                }));

                setReports(updatedReports);
            }
        }
        fetchReports();
    }, []);

    const filteredReports = selectedProject === "All Projects"
        ? reports
        : reports.filter(report => report.project_id?.project_name === selectedProject);

    // Hàm điều hướng đến trang đánh giá
    const handleEvaluate = (internId, type) => {
        navigate(`/evaluation?intern_id=${internId}&type=${type}`);
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Intern Reports</h2>

            <div style={styles.filterSection}>
                <label>Project: </label>
                <select 
                    value={selectedProject} 
                    onChange={(e) => setSelectedProject(e.target.value)}
                    style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
                >
                    <option value="All Projects">All Projects</option>
                    {[...new Set(reports.map(report => report.project_id?.project_name))].map((name, index) => (
                        <option key={index} value={name}>{name}</option>
                    ))}
                </select>
            </div>

            {/* Table */}
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Intern Name</th>
                        <th style={styles.th}>Project Name</th>
                        <th style={styles.th}>Position ID</th>
                        <th style={styles.th}>Weekly Report</th>
                        <th style={styles.th}>Evaluate</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredReports.map((report, index) => (
                        <tr key={index}>
                            <td style={styles.td}>{report.intern_name || "No Name"}</td>
                            <td style={styles.td}>{report.project_id?.project_name || "No Project"}</td>
                            <td style={styles.td}>{report.intern_id?.position_id || "No Position"}</td>
                            <td style={styles.td}>
                                <a  target="_blank" rel="noopener noreferrer">
                                    {report.report}: {report.report_link}
                                </a>
                            </td>
                            <td style={styles.td}>
                                <button 
                                    style={{ ...styles.btn, ...styles.btnSuccess }} 
                                    onClick={() => handleEvaluate(report.intern_id?._id, "MIDTERM")}
                                >
                                    Midterm
                                </button>
                                <button 
                                    style={{ ...styles.btn, ...styles.btnDanger }} 
                                    onClick={() => handleEvaluate(report.intern_id?._id, "FINAL")}
                                >
                                    Final
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default InternReports;
