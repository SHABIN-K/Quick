import axios from "axios";
import Cookies from "js-cookie";

const AUTH_TOKEN = `Bearer ${Cookies.get("token")}`;
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

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

axiosPublic.defaults.headers.common["Authorization"] = AUTH_TOKEN;

export default axiosPublic;
