import axios from "axios";

export const axiosJWT = axios.create();

export const getCandidatesByMentor = async (id) => {
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/candidate/get-candidate-info/${id}`);
        return res.data;
    } catch (error) {
        console.error("Error fetching mentor details:", error);
        throw error;
    }
};

export const getCandidatesByProjectId = async (id) => {
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/candidate/get-candidate-by-project/${id}`);
        return res.data;
    } catch (error) {
        console.error("Error fetching mentor details:", error);
        throw error;
    }
};

export const acceptCandidate = async (projectId, candidateId) => {
    try {
        const res = await axios.put(`${process.env.REACT_APP_API_URL_BACKEND}/candidate/accept-candidate/projects/${projectId}/candidates/${candidateId}`);
        return res.data;
    } catch (error) {
        console.error("Error fetching mentor details:", error);
        throw error;
    }
};