import { create } from "zustand";
import tokenStorage from "../storage/token";
import authService from "../services/authService";

const useAuthStore = create((set, get) => ({
	user: null,
	token: null,
	isAuthenticated: false,
	isLoading: false,

	initializeAuth: async () => {
		set({ isLoading: true });
		try {
			const token = await tokenStorage.getToken();
			if (token) {
				const user = await authService.me();
				set({ user, token, isAuthenticated: true });
			}
		} catch (error) {
			console.error("Auth initialization error:", error);
			await authService.logout();
			set({ user: null, token: null, isAuthenticated: false });
		} finally {
			set({ isLoading: false });
		}
	},

	login: async (email, password) => {
		set({ isLoading: true });
		try {
			const data = await authService.login(email, password);
			const user = await authService.me();
			set({
				user,
				token: data.token,
				isAuthenticated: true,
				isLoading: false,
			});
			return data;
		} catch (error) {
			set({ isLoading: false });
			throw error;
		}
	},

	logout: async () => {
		await authService.logout();
		set({ user: null, token: null, isAuthenticated: false });
	},

	setUser: (user) => set({ user }),

	getUser: () => get().user,
}));

export default useAuthStore;
