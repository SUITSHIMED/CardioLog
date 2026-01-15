import tokenStorage from "../storage/token";

const BASE_URL = "http://192.168.40.180:3000/api";

const authService = {
	login: async (email, password) => {
		const res = await fetch(`${BASE_URL}/auth/login`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email, password }),
		});

		const data = await res.json();

		if (!res.ok) {
			throw new Error(data.message || "Login failed");
		}

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

		const res = await fetch(`${BASE_URL}/auth/me`, {
			method: "GET",
			headers: { Authorization: `Bearer ${token}` },
		});

		const data = await res.json();
		if (!res.ok) throw new Error(data.message || "Failed to fetch user");
		return data;
	},
};

export default authService;
