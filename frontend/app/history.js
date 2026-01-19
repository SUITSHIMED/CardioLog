import { View, Text, StyleSheet, FlatList } from "react-native";
import { useEffect, useState } from "react";
import api from "../src/api/api";
import { useReadingsStore } from "../src/stores";

export default function History() {
	const [loading, setLoading] = useState(true);
	
	// Get readings and setReadings from Zustand store
	const { readings, setReadings } = useReadingsStore();

	useEffect(() => {
		const loadReadings = async () => {
			try {
				// Fetch readings from API using axios-based fetchWithAuth
				const { res, data } = await api.fetchWithAuth("/readings/my");

				if (!res.ok) {
					throw new Error("Failed to load readings");
				}

				// Save readings to Zustand store
				setReadings(data);
			} catch (err) {
				console.log("HISTORY ERROR:", err.message);
			} finally {
				setLoading(false);
			}
		};

		loadReadings();
	}, [setReadings]);

	const renderItem = ({ item }) => (
		<View style={styles.card}>
            <View style={styles.leftBar} />
            <View style={styles.mainInfo}>
                <Text style={styles.bp}>
                    {item.systolic}<Text style={styles.slash}>/</Text>{item.diastolic}
                    <Text style={styles.mmhg}> mmHg</Text>
                </Text>
                <Text style={styles.pulse}>❤️ {item.pulse} BPM</Text>
            </View>
            <View style={styles.dateInfo}>
                <Text style={styles.dateText}>{new Date(item.createdAt).toLocaleDateString()}</Text>
                <Text style={styles.timeText}>{new Date(item.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</Text>
            </View>
		</View>
	);

	return (
		<View style={styles.container}>
			<Text style={styles.title}>History Log</Text>
			<FlatList
				data={readings}
				keyExtractor={(item) => item.id}
				renderItem={renderItem}
				contentContainerStyle={{ paddingBottom: 40 }}
				ListEmptyComponent={<Text style={styles.empty}>No readings recorded yet.</Text>}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: "#F8FAFC", padding: 20 },
	title: { fontSize: 28, fontWeight: "800", color: "#1E293B", marginBottom: 24, marginTop: 40 },
	card: { 
        backgroundColor: "#FFFFFF", borderRadius: 16, marginBottom: 12, 
        flexDirection: "row", alignItems: "center", padding: 16,
        shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 5, elevation: 2
    },
    leftBar: { width: 4, height: '100%', backgroundColor: '#E11D48', borderRadius: 2, marginRight: 16 },
    mainInfo: { flex: 1 },
	bp: { fontSize: 22, fontWeight: "800", color: "#1E293B" },
    slash: { color: '#CBD5E1' },
    mmhg: { fontSize: 12, color: '#94A3B8', fontWeight: '400' },
	pulse: { fontSize: 14, color: "#64748B", marginTop: 4, fontWeight: '600' },
    dateInfo: { alignItems: 'flex-end' },
	dateText: { fontSize: 14, fontWeight: '700', color: "#1E293B" },
    timeText: { fontSize: 12, color: "#94A3B8", marginTop: 2 },
	empty: { textAlign: "center", color: "#94A3B8", marginTop: 60, fontSize: 16 },
});