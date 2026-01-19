import { create } from "zustand";

const useReadingsStore = create((set, get) => ({
	readings: [],
	stats: null,
	isLoading: false,
	error: null,

	// Set readings
	setReadings: (readings) => set({ readings }),

	// Set stats
	setStats: (stats) => set({ stats }),

	// Set loading state
	setLoading: (isLoading) => set({ isLoading }),

	// Set error
	setError: (error) => set({ error }),

	// Add a new reading
	addReading: (reading) => {
		const readings = get().readings;
		set({ readings: [reading, ...readings] });
	},

	// Clear all readings
	clearReadings: () => set({ readings: [], stats: null }),

	// Get readings
	getReadings: () => get().readings,

	// Get stats
	getStats: () => get().stats,
}));

export default useReadingsStore;
