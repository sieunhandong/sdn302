import axios from "axios";

export const axiosJWT = axios.create();

export const getMentorInfo = async () => {
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/mentor/get-mentor-info`);
        return res.data;
    } catch (error) {
        console.error("Error fetching mentor details:", error);
        throw error;
    }
};
