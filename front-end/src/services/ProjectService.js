import axios from "axios"

export const axiosJWT = axios.create()

export const createProject = async (data, token) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL_BACKEND}/project/create-project`,
        data,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}` // Gửi token
            }
        }
    );
    return res.data;
};

export const getAllProject = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/project/list-all-projects`)
    return res.data
}
export const getDetailsProject = async (id) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL_BACKEND}/project/list-project-detail/${id}`)
    return res.data
}

export const updateProject = async (id, data, token) => {
    const res = await axios.put(`${process.env.REACT_APP_API_URL_BACKEND}/project/update-project/${id}`,
        data,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}` // Gửi token
            }
        }
    );
    return res.data;
};

export const deleteProject = async (id, token) => {
    const res = await axios.patch(`${process.env.REACT_APP_API_URL_BACKEND}/project/change-status-project/${id}`,
        {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
    );
    return res.data;
};
