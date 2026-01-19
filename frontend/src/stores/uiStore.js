import { create } from "zustand";

const useUIStore = create((set) => ({
	activeTab: "home",
	theme: "light",
	isModalOpen: false,
	modalContent: null,

	// Set active tab
	setActiveTab: (tab) => set({ activeTab: tab }),

	// Set theme
	setTheme: (theme) => set({ theme }),

	// Toggle modal
	toggleModal: (isOpen, content = null) => set({ isModalOpen: isOpen, modalContent: content }),

	// Open modal
	openModal: (content) => set({ isModalOpen: true, modalContent: content }),

	// Close modal
	closeModal: () => set({ isModalOpen: false, modalContent: null }),
}));

export default useUIStore;
