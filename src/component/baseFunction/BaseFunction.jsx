import axios from "axios";
import Swal from "sweetalert2";

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

export const icon_income = "https://img.icons8.com/?size=500&id=36950&format=png&color=000000";
export const icon_expense = "https://img.icons8.com/?size=500&id=36948&format=png&color=000000";

export const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const searchCategory = async () => {
  try {
    const res = await axiosInstance.get(`${api_url}/category`);
    return res.data;
  } catch (err) {
    console.error("Error fetching categories:", err.response ? err.response.data : err.message);
    throw err;
  }
};

export const searchDataByUsername = async (username) => {
  try {
    const res = await axiosInstance.get(`${api_url}/income-expense/${username}`);
    return res.data;
  } catch (err) {
    console.log("Failed to search data by username:", err.response ? err.response.data : err.message);
    throw err;
  }
};

export const addOrder = async (data) => {
  try {
    const res = await axiosInstance.post(`${api_url}/income-expense/add`, data);
    return res.data;
  } catch (err) {
    console.log("Failed to add order:", err.response ? err.response.data : err.message);
    throw err;
  }
};

export const updateOrder = async (id, data) => {
  try {
    const res = await axiosInstance.put(`${api_url}/income-expense/update/${id}`, data);
    return res.data;
  } catch (err) {
    console.log("Failed to update order:", err.response ? err.response.data : err.message);
    throw err;
  }
};

export const deleteOrder = async (id) => {
  try {
    const res = await axiosInstance.delete(`${api_url}/income-expense/delete/${id}`);
    return res.data;
  } catch (err) {
    console.error("Failed to delete order:", err.response ? err.response.data : err.message);
    throw err;
  }
};

export const swal_alert = (title, text, icon) => {
  Swal.fire({
    title: title,
    text: text,
    icon: icon,
  });
};
