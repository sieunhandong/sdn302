import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL_BACKEND + "/report/all-reports";

// Lấy tất cả báo cáo thực tập sinh
export const getAllReports = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/report/all-reports`)
    return res.data
}

// Lấy báo cáo theo ID
export const getReportById = async (id) => {
    try {
        const res = await axios.get(`${API_URL}/${id}`);
        return res.data;
    } catch (error) {
        console.error("Error fetching report:", error);
        return { status: "ERR", message: error.message };
    }
};

// Tạo báo cáo mới
export const createReport = async (data, token) => {
    try {
        const res = await axios.post(`${API_URL}`, data, {
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
export const updateReport = async (id, data, token) => {
    try {
        const res = await axios.put(`${API_URL}/${id}`, data, {
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
export const deleteReport = async (id, token) => {
    try {
        const res = await axios.delete(`${API_URL}/${id}`, {
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
