import axios from "axios";

// Lấy tất cả báo cáo thực tập sinh
export const getAllRecruitments = async (token) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/recruitment/get-all-recruitment`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
    )
    return res.data
}
export const getAllRecruitmentsByMentorId = async (id, token) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/recruitment/get-all-recruitment-by-mentor/${id}`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
    )
    return res.data
}

// // Lấy báo cáo theo ID
// export const getReportById = async (id) => {
//     try {
//         const res = await axios.get(`${API_URL}/${id}`);
//         return res.data;
//     } catch (error) {
//         console.error("Error fetching report:", error);
//         return { status: "ERR", message: error.message };
//     }
// };

// Tạo báo cáo mới
export const createRecruitment = async (data, token) => {
    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL_BACKEND}/recruitment/create-recruitment`, data, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });
        return res.data;
    } catch (error) {
        console.error("Error creating report:", error);
        return { status: "ERR", message: error.message };
    }
};

// Cập nhật báo cáo
export const updateRecruitment = async (id, data, token) => {
    try {
        const res = await axios.put(`${process.env.REACT_APP_API_URL_BACKEND}/recruitment/update-recruitment/${id}`, data, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });
        return res.data;
    } catch (error) {
        console.error("Error updating report:", error);
        return { status: "ERR", message: error.message };
    }
};

// Xóa báo cáo
export const deleteRecruitment = async (id, token) => {
    try {
        const res = await axios.delete(`${process.env.REACT_APP_API_URL_BACKEND}/recruitment/delete-recruitment/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data;
    } catch (error) {
        console.error("Error deleting report:", error);
        return { status: "ERR", message: error.message };
    }
};
