import Axios from "axios";
import { API_BASE_URL } from "./consts";
import { cookies } from "next/headers";

const axios = Axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true,
});

axios.interceptors.request.use(
  (config) => {
    const token = cookies().get("opxpress_access_token")?.value;

    if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default axios;
