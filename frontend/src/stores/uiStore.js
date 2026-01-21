import { create } from "zustand";

const useUIStore = create((set) => ({
	activeTab: "home",
	theme: "light",
	isModalOpen: false,
	modalContent: null,

	setActiveTab: (tab) => set({ activeTab: tab }),

	setTheme: (theme) => set({ theme }),

	toggleModal: (isOpen, content = null) => set({ isModalOpen: isOpen, modalContent: content }),

	openModal: (content) => set({ isModalOpen: true, modalContent: content }),

	closeModal: () => set({ isModalOpen: false, modalContent: null }),
}));

export default useUIStore;
