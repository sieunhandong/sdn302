import axios from "axios";

export const axiosJWT = axios.create();

export const getCandidatesByMentor = async (id, token) => {
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/candidate/get-candidate-info/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return res.data;
    } catch (error) {
        console.error("Error fetching mentor details:", error);
        throw error;
    }
};

export const getCandidatesByProjectId = async (id, token) => {
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/candidate/get-candidate-by-project/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return res.data;
    } catch (error) {
        console.error("Error fetching mentor details:", error);
        throw error;
    }
};

export const acceptCandidate = async (projectId, id, token) => {
    console.log("token", token)
    try {
        const res = await axios.put(`${process.env.REACT_APP_API_URL_BACKEND}/candidate/accept-candidate/projects/${projectId}/candidates/${id}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return res.data;
    } catch (error) {
        console.error("Error fetching mentor details:", error);
        throw error;
    }
};
export const rejectCandidate = async (projectId, id, token) => {
    console.log("Sending token:", token);

    try {
        const res = await axios.delete(
            `${process.env.REACT_APP_API_URL_BACKEND}/candidate/projects/${projectId}/candidates/${id}/reject`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return res.data;
    } catch (error) {
        console.error("Error rejecting candidate:", error.response?.data || error.message);
        throw error;
    }
};
