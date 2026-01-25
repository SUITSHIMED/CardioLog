import tokenStorage from "../storage/token";
import api from "../api/api";

const authService = {
	login: async (email, password) => {
		const { data } = await api.post("/auth/login", {
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

		const { data } = await api.get("/auth/me");
		return data;
	},
};

export default authService;
