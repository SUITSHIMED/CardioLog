import axios from "axios";
import tokenStorage from "../storage/token";

const BASE_URL = __DEV__
	? "http://192.168.1.136:3000/api" 
	: "https://cardiolog-production.up.railway.app/api";

const axiosInstance = axios.create({
	baseURL: BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});


axiosInstance.interceptors.request.use(async (config) => {
	const token = await tokenStorage.getToken();
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

// Add error interceptor for debugging
axiosInstance.interceptors.response.use(
	(response) => response,
	(error) => {
		console.error("API Error:", {
			url: error.config?.url,
			status: error.response?.status,
			message: error.response?.data?.message,
			error: error.message,
		});
		return Promise.reject(error);
	}
);

export async function fetchWithAuth(path, options = {}) {
	try {
		const response = await axiosInstance({
			url: path,
			...options,
		});
		// Return in format compatible with old fetch-based code
		return {
			res: { ok: true, status: response.status },
			data: response.data,
		};
	} catch (error) {
		if (error.response) {
			// Request was made and server responded with error status
			return {
				res: { ok: false, status: error.response.status },
				data: error.response.data,
			};
		}
		throw error;
	}
}

export default {
	...axiosInstance,
	fetchWithAuth,
};
