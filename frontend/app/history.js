import { View, Text, StyleSheet, FlatList } from "react-native";
import { useEffect, useState } from "react";
import api from "../src/api/api";
import { colors } from "../src/theme/colors";

export default function History() {
	const [readings, setReadings] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadReadings = async () => {
			try {
				const { res, data } = await api.fetchWithAuth("/readings/my");

				if (!res.ok) {
					throw new Error("Failed to load readings");
				}

				setReadings(data);
			} catch (err) {
				console.log("HISTORY ERROR:", err.message);
			} finally {
				setLoading(false);
			}
		};

		loadReadings();
	}, []);

	const renderItem = ({ item }) => (
		<View style={styles.card}>
			<Text style={styles.bp}>
				{item.systolic} / {item.diastolic}
			</Text>
			<Text style={styles.pulse}>Pulse: {item.pulse}</Text>
			<Text style={styles.date}>
				{new Date(item.createdAt).toLocaleDateString()}
			</Text>
		</View>
	);

	if (loading) {
		return (
			<View style={styles.center}>
				<Text>Loading...</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>History</Text>

			<FlatList
				data={readings}
				keyExtractor={(item) => item.id}
				renderItem={renderItem}
				contentContainerStyle={{ paddingBottom: 20 }}
				ListEmptyComponent={
					<Text style={styles.empty}>No readings yet</Text>
				}
			/>
		</View>
	);
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background,
		padding: 20,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		color: colors.dark,
		marginBottom: 20,
	},
	card: {
		backgroundColor: colors.card,
		padding: 16,
		borderRadius: 14,
		marginBottom: 12,
		borderWidth: 1,
		borderColor: "#E2E8F0",
	},
	bp: {
		fontSize: 18,
		fontWeight: "bold",
		color: colors.primary,
	},
	pulse: {
		fontSize: 14,
		color: colors.dark,
		marginTop: 4,
	},
	date: {
		fontSize: 12,
		color: "#64748B",
		marginTop: 6,
	},
	center: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	empty: {
		textAlign: "center",
		color: "#64748B",
		marginTop: 40,
	},
});
