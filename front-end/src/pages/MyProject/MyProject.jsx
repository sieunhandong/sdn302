import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { getProjectByUserId } from '../../services/ProjectService';
import { WrapperButtonMore, WrapperProducts } from '../ProjectPage/style';
import SliderComponent from '../../components/SliderComponent/SliderComponent';
import slide1 from '../../assets/images/slide1.png';
import slide2 from '../../assets/images/slide2.png';
import slide3 from '../../assets/images/slide3.png';
import slide4 from '../../assets/images/emyeu.png';
import CardComponent from '../../components/CardComponent/CardComponent';
import { useSelector } from 'react-redux';

const MyProject = () => {
    const userId = useSelector((state) => state.user?.id);
    const token = useSelector((state) => state.user?.access_token);
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        if (!userId) return;

        const fetchProjects = async () => {
            try {
                const response = await getProjectByUserId(userId, token);
                console.log("Dữ liệu projects từ API:", response);
                console.log("response", response.data)
                if (response?.data && Array.isArray(response.data)) {
                    setProjects(response.data);
                } else {
                    console.error("API không trả về mảng:", response);
                    setProjects([]);
                }
            } catch (error) {
                console.error("Lỗi khi lấy danh sách project:", error);
                setProjects([]);
            }
        };

        fetchProjects();
    }, [userId]);

    return (
        <>
            <div style={{ width: '1270px', margin: '0 auto' }}></div>
            <div className='body' style={{ width: '100%', backgroundColor: '#efefef' }}>
                <div id="container" style={{ height: '1000px', width: '1270px', margin: "0 auto" }}>
                    <WrapperProducts>
                        {projects.length === 0 ? (
                            <p style={{ textAlign: "center", fontSize: "18px", color: "#555", marginTop: "20px" }}>
                                No Product Found
                            </p>
                        ) : (
                            projects.map((project) => (
                                <CardComponent
                                    key={project._id}
                                    name={project.project_name}
                                    mentor={project.mentor_id.roll_number}
                                    image={project.project_img}
                                    description={project.project_details}
                                    start={project.project_start}
                                    end={project.project_end}
                                    onClick={() => navigate(`/project-details-for-mentor/${project._id}`)}

                                />
                            ))
                        )}
                    </WrapperProducts>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px' }}>
                        <WrapperButtonMore textButton="View more" type="outline" styleButton={{
                            border: '1px solid rgb(11,116,229)', color: 'rgb(11,116,229)',
                            width: '240px', height: '38px', borderRadius: '4px'
                        }}
                            styleTextButton={{ fontWeight: 500 }}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default MyProject;
