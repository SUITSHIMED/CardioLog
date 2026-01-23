import axios from "axios";
import tokenStorage from "../storage/token";
import { useAuthStore } from "../stores"; 

const BASE_URL = __DEV__
    ? "http://192.168.1.136:3000/api" 
    : "https://cardiolog-production.up.railway.app/api";

const api = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(async (config) => {
    const token = await tokenStorage.getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            console.warn("Session expired. Logging out...");
            const { logout } = useAuthStore.getState(); 
            await logout();
        }

        console.error("API Error:", {
            url: error.config?.url,
            status: error.response?.status,
            message: error.response?.data?.message,
        });
        return Promise.reject(error);
    }
);

export default api;