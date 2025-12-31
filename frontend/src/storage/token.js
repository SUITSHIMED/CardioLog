import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "token";
const USER_ID_KEY = "userId";

const tokenStorage = {
	setToken: async (t) => {
		try {
			await AsyncStorage.setItem(TOKEN_KEY, t);
		} catch (e) {
			console.error("setToken error", e);
			throw e;
		}
	},
	getToken: async () => {
		try {
			return await AsyncStorage.getItem(TOKEN_KEY);
		} catch (e) {
			console.error("getToken error", e);
			return null;
		}
	},
	removeToken: async () => {
		try {
			await AsyncStorage.removeItem(TOKEN_KEY);
		} catch (e) {
			console.error("removeToken error", e);
		}
	},
	setUserId: async (id) => {
		try {
			await AsyncStorage.setItem(USER_ID_KEY, String(id));
		} catch (e) {
			console.error("setUserId error", e);
		}
	},
	getUserId: async () => {
		try {
			return await AsyncStorage.getItem(USER_ID_KEY);
		} catch (e) {
			console.error("getUserId error", e);
			return null;
		}
	},
	removeUserId: async () => {
		try {
			await AsyncStorage.removeItem(USER_ID_KEY);
		} catch (e) {
			console.error("removeUserId error", e);
		}
	},
};

export default tokenStorage;
