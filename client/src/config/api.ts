import axios from "axios";

const BASE_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:5000";

const axiosPublic = axios.create({
  baseURL: `${BASE_URL}/api`,
});

export const axiosPrivate = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default axiosPublic;
