import axios from "axios";

export const axiosJWT = axios.create();

export const getInternsByProject = async (id) => {
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/intern/get-interns-by-project/${id}`);
        return res.data;
    } catch (error) {
        console.error("Error fetching mentor details:", error);
        throw error;
    }
};
