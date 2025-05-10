import axios from "axios";

export const axiosJWT = axios.create();
export const createShedule = async (data, token) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL_BACKEND}/schedule/create-schedule`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Gửi token
      },
    }
  );
  return res.data;
};
export const getAllSchedules = async (token) => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL_BACKEND}/schedule/list-schedule`,

    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};
export const updateSchedule = async (id, data, token) => {
  const res = await axios.put(
    `${process.env.REACT_APP_API_URL_BACKEND}/schedule/update-schedule/${id}`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const deleteSchedule = async (id, token) => {
  const res = await axios.patch(
    `${process.env.REACT_APP_API_URL_BACKEND}/schedule/delete-schedule/${id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const getScheduleByMentorId = async (token, id) => {
  console.log("id-all", id);
  console.log("token-all", token);
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_URL_BACKEND}/schedule/view-schedule/${id}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};
