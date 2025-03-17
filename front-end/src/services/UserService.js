import axios from "axios";

export const axiosJWT = axios.create();

export const loginUser = async (data) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL_BACKEND}/user/sign-in`,
    data
  );
  return res.data;
};
export const signUpUser = async (data) => {
    console.log('data', data)
    const res = await axios.post(`${process.env.REACT_APP_API_URL_BACKEND}/user/sign-up`, data)
    console.log("res", res)
    return res.data
}
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL_BACKEND}/user/sign-up`,
    data
  );
  return res.data;


export const getDetailsUser = async (id, token) => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_URL_BACKEND}/user/get-details/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};


export const updateUser = async (id, data) => {
    const res = await axios.put(`${process.env.REACT_APP_API_URL_BACKEND}/user/update-user/${id}`, data)
    return res.data
}
export const changePassword = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL_BACKEND}/user/change-password`, data)
    return res.data
}
export const refreshToken = async () => {
    console.log('🔄 Đang refresh token...');
    const res = await axios.post(
        `${process.env.REACT_APP_API_URL_BACKEND}/user/refresh-token`,
        {}, // ✅ Body rỗng, vì refresh token nằm trong cookie
        {
            withCredentials: true, // 🔥 QUAN TRỌNG: Cho phép gửi cookie
            headers: {
                "Content-Type": "application/json"
            }
        }
    );
    return res.data;

export const refreshToken = async (token) => {
  console.log("ham refresh token", token);
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL_BACKEND}/user/refresh-token`,
    { refresh_token: token },
    {
      headers: {
        "Content-Type": "application/json", // ✅ Đảm bảo gửi JSON
      },
    }
  );
  return res.data;

};

export const logoutUser = async () => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL_BACKEND}/user/log-out`
  );
  return res.data;
};

export const getAllMentor = async (token) => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL_BACKEND}/user/get-all-mentor`,

    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};
export const getAllUsers = async (token) => {
    return axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/user/get-all-user`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
    });
};

export const createUser = async (data, token) => {
    return axios.post(`${process.env.REACT_APP_API_URL_BACKEND}/user/add-user`, data, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
    });
};

export const deleteUser = async (userId, token) => {
    return axios.delete(`${process.env.REACT_APP_API_URL_BACKEND}/user/delete-user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
    });
};