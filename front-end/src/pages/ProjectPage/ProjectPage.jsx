import React, { useEffect, useState } from 'react'
import { WrapperButtonMore, WrapperProducts } from './style'
import SliderComponent from '../../components/SliderComponent/SliderComponent'
import slide1 from '../../assets/images/slide1.png';
import slide2 from '../../assets/images/slide2.png';
import slide3 from '../../assets/images/slide3.png';
import slide4 from '../../assets/images/emyeu.png';
import CardComponent from '../../components/CardComponent/CardComponent';
import * as ProjectService from '../../services/ProjectService';
import { useNavigate } from 'react-router-dom';

function ProjectPage() {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await ProjectService.getAllProject();
                console.log("Dữ liệu projects từ API:", response);

                if (Array.isArray(response.data)) {
                    setProjects(response.data); // Chỉ lấy mảng data
                } else {
                    console.error("API không trả về mảng:", response);
                    setProjects([]); // Gán mảng rỗng để tránh lỗi
                }
            } catch (error) {
                console.error("Lỗi khi lấy danh sách project:", error);
                setProjects([]); // Gán mảng rỗng khi có lỗi
            }
        };
        fetchProjects();
    }, []);
    return (
        <>
            <div style={{ width: '1270px', margin: '0 auto' }}>

            </div>
            <div className='body' style={{ width: '100%', backgroundColor: '#efefef' }}>
                <div id="container" style={{ height: '1000px', width: '1270px', margin: "0 auto" }}>
                    <SliderComponent arrImages={[slide1, slide2, slide3, slide4]} />
                    <WrapperProducts>
                        {projects.map((project) => (
                            <CardComponent
                                key={project._id}
                                name={project.project_name}
                                mentor={project.mentor_name}
                                image={project.project_img}
                                description={project.project_details}
                                start={project.project_start}
                                end={project.project_end}
                                onClick={() => navigate(`/project/${project._id}`)}
                            />

                        ))}
                    </WrapperProducts>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px' }}>
                        <WrapperButtonMore textButton="Xem them" type="outline" styleButton={{
                            border: '1px solid rgb(11,116,229)', color: 'rgb(11,116,229)',
                            width: '240px', height: '38px', borderRadius: '4px'
                        }}
                            styleTextButton={{ fontWeight: 500 }}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProjectPage