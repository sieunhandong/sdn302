import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux'; // Import useSelector
import * as ProjectService from '../../services/ProjectService';

const ProjectDetails = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);

    // Lấy role từ Redux
    const role = useSelector((state) => state.user.role);

    useEffect(() => {
        const fetchProjectDetails = async () => {
            try {
                const response = await ProjectService.getDetailsProject(id);
                setProject(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy chi tiết project:", error);
            }
        };
        fetchProjectDetails();
    }, [id]);

    if (!project) return <div>Loading...</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h1>{project.project_name}</h1>
            <img src={project.project_img} alt={project.project_name} style={{ width: '100%', maxHeight: '400px' }} />
            <p><strong>Người hướng dẫn:</strong> {project.mentor_name}</p>
            <p><strong>Chi tiết:</strong> {project.project_details}</p>
            <p><strong>Bắt đầu:</strong> {project.project_start}</p>
            <p><strong>Kết thúc:</strong> {project.project_end}</p>

            <h2>Các vị trí tuyển dụng:</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                {project.positions?.map((position) => (
                    <div key={position._id} style={{
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        padding: '15px',
                        width: '300px',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                        backgroundColor: '#fff'
                    }}>
                        <h3>{position.position_name}</h3>
                        <p><strong>Kỹ năng yêu cầu:</strong></p>
                        <ul>
                            {position.required_skills.map((skill, index) => (
                                <li key={index}>{skill}</li>
                            ))}
                        </ul>

                        {/* Hiển thị nút dựa trên role */}
                        {role === "CANDIDATE" ? (
                            <button style={{
                                backgroundColor: '#007bff',
                                color: 'white',
                                padding: '10px',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                width: '100%',
                                marginTop: '10px'
                            }}
                                onClick={() => alert(`Bạn đã apply vào vị trí ${position.position_name}`)}
                            >
                                Apply
                            </button>
                        ) : role === "MENTOR" ? (
                            <button style={{
                                backgroundColor: '#28a745',
                                color: 'white',
                                padding: '10px',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                width: '100%',
                                marginTop: '10px'
                            }}
                                onClick={() => alert(`Xem danh sách ứng viên cho vị trí ${position.position_name}`)}
                            >
                                View Candidate Apply
                            </button>
                        ) : null}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProjectDetails;
