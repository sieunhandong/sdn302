import axios from "axios"

export const axiosJWT = axios.create()

export const loginUser = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL_BACKEND}/user/sign-in`, data)
    return res.data
}
export const signUpUser = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL_BACKEND}/user/sign-up`, data)
    return res.data
}
export const getDetailsUser = async (id, token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL_BACKEND}/user/get-details/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
    return res.data
}

export const refreshToken = async (token) => {
    console.log('ham refresh token', token)
    const res = await axios.post(`${process.env.REACT_APP_API_URL_BACKEND}/user/refresh-token`,
        { refresh_token: token },
        {
            headers: {
                "Content-Type": "application/json" // ✅ Đảm bảo gửi JSON
            }
        }
    );
    return res.data;
};

export const logoutUser = async () => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL_BACKEND}/user/log-out`);
    return res.data;
};
