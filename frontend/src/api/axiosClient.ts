import axios from "axios";
import {API_URL} from "../config";

const axiosClient = axios.create({
  baseURL: `${API_URL}`,
  headers: {
    "Content-Type": "application/json"
  }
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if(token && config.headers){
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;