import axios from "axios";

const api_url = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: api_url,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const login = async (data) => {
  try {
    const res = await axios.post(`${api_url}/user-authen/login`, data);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    localStorage.setItem("token", res.data.token);
    return res.data;
  } catch (err) {
    console.error("Error during login request:", err.response ? err.response.data : err.message);
    throw err;
  }
};

export const signup = async (data) => {
  try {
    const res = await axios.post(`${api_url}/user-authen/signup`, data);
    return res.data;
  } catch (err) {
    console.error("Error during sign up request:", err.response ? err.response.data : err.message);
    throw err;
  }
};

export const updateUser = async (data) => {
  try {
    const res = await axiosInstance.put(`${api_url}/user-authen/update/${data.username}`, data);
    return res.data;
  } catch (err) {
    console.error("Error during user request:", err.response ? err.response.data : err.message);
    throw err;
  }
};

export const deleteUser = async (username) => {
  try {
    const res = await axiosInstance.delete(`${api_url}/user-authen/delete/${username}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    console.error("Error during user deletion request:", err.response ? err.response.data : err.message);
    throw err;
  }
};

export const logout = async () => {
  try {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    return { message: "Logout successful" };
  } catch (err) {
    console.error("Error during logout:", err.response ? err.response.data : err.message);
    throw err;
  }
};

export const changePassword = async (data) => {
  try {
    const res = await axiosInstance.post(`${api_url}/user-authen/change-password`, data);
    return res.data;
  } catch (err) {
    console.error("Error during user request:", err.response ? err.response.data : err.message);
    throw err;
  }
};
