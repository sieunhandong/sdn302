import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL_BACKEND + "/evaluation";

// 📌 Lấy danh sách tất cả đánh giá
export const getAllEvaluations = async () => {
    try {
        const res = await axios.get(API_URL);
        return res.data;
    } catch (error) {
        console.error("Error fetching evaluations:", error);
        return { status: "ERR", message: error.message };
    }
};

// 📌 Lấy đánh giá theo ID
export const getEvaluationById = async (id) => {
    try {
        const res = await axios.get(`${API_URL}/${id}`);
        return res.data;
    } catch (error) {
        console.error("Error fetching evaluation:", error);
        return { status: "ERR", message: error.message };
    }
};

// 📌 Tạo mới đánh giá
export const createEvaluation = async (data) => {
    try {
        const res = await axios.post(API_URL, data, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return res.data;
    } catch (error) {
        console.error("Error creating evaluation:", error);
        return { status: "ERR", message: error.message };
    }
};

// 📌 Cập nhật đánh giá theo ID
export const updateEvaluation = async (id, data) => {
    try {
        const res = await axios.put(`${API_URL}/${id}`, data, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return res.data;
    } catch (error) {
        console.error("Error updating evaluation:", error);
        return { status: "ERR", message: error.message };
    }
};

// 📌 Xóa đánh giá theo ID
export const deleteEvaluation = async (id) => {
    try {
        await axios.delete(`${API_URL}/${id}`);
        return { status: "OK", message: "Deleted successfully" };
    } catch (error) {
        console.error("Error deleting evaluation:", error);
        return { status: "ERR", message: error.message };
    }
};

// 📌 Tìm kiếm đánh giá theo `intern_id` và `type`
export const searchEvaluations = async (intern_id, type) => {
    try {
        const res = await axios.get(`${API_URL}/search`, {
            params: { intern_id, type },
        });
        return res.data;
    } catch (error) {
        console.error("Error searching evaluations:", error);
        return { status: "ERR", message: error.message };
    }
};
