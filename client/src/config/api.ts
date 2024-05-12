import axios from "axios";
import Cookies from "js-cookie";

const AUTH_TOKEN = `Bearer ${Cookies.get("-secure-node-authToken")}`;
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

const clientApi = axios.create({
  baseURL: `${BASE_URL}/api`,
});

export const privateApi = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default clientApi;
