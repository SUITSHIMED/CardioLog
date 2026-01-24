import axios from "axios";
import tokenStorage from "../storage/token";

const BASE_URL = __DEV__
	? "http://192.168.1.104:3000/api" 
	: "https://cardiolog-production.up.railway.app/api";

const axiosInstance = axios.create({
	baseURL: BASE_URL,
});


axiosInstance.interceptors.request.use(async (config) => {
	const token = await tokenStorage.getToken();
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

const authService = {
	login: async (email, password) => {
		const { data } = await axiosInstance.post("/auth/login", {
			email,
			password,
		});

		if (data.token) {
			await tokenStorage.setToken(data.token);
		}

		if (data.userId) {
			await tokenStorage.setUserId(data.userId);
		}

		return data;
	},
	logout: async () => {
		await tokenStorage.removeToken();
		await tokenStorage.removeUserId();
	},
	getToken: async () => {
		return await tokenStorage.getToken();
	},
	me: async () => {
		const token = await tokenStorage.getToken();
		if (!token) throw new Error("No token available");

		const { data } = await axiosInstance.get("/auth/me");
		return data;
	},
};

export default authService;
