import axios from "axios";

export const axiosJWT = axios.create();

export const getInternsByProject = async (id, token) => {
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/intern/get-interns-by-project/${id}`,
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
