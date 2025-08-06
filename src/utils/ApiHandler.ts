import axios, {AxiosError} from "axios";
import {ServerUrl} from "../constants/ServerUrl.ts";
import Cookies from "js-cookie";

const apiHandler = axios.create({
    baseURL: ServerUrl.SERVER,
    withCredentials: true
});


apiHandler.interceptors.request.use((config) => {
      const token = Cookies.get("token");
      if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          }
      return config;
    });

apiHandler.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => Promise.reject(error.response?.data));

export default apiHandler;