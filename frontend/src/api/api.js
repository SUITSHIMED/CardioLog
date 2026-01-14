import tokenStorage from "../storage/token";

const BASE_URL = "http://192.168.1.104:3000/api";

export async function fetchWithAuth(path, options = {}) {
	const token = await tokenStorage.getToken();

	const headers = {
		"Content-Type": "application/json",
		...(options.headers || {}),
	};

	if (token) {
		headers.Authorization = `Bearer ${token}`;
	}

	const res = await fetch(`${BASE_URL}${path}`, {
		...options,
		headers,
	});

	const data = await res.json().catch(() => null);

	return { res, data };
}

export default {
	fetchWithAuth,
};
