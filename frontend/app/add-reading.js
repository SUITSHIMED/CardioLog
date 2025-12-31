import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useState } from "react";
import api from "../src/api/api";
import { colors } from "../src/theme/colors";
import { useRouter } from "expo-router";

export default function AddReading() {
	const [systolic, setSystolic] = useState("");
	const [diastolic, setDiastolic] = useState("");
	const [pulse, setPulse] = useState("");
	const router = useRouter();

	const save = async () => {
		try {
			const { res, data } = await api.fetchWithAuth("/readings", {
				method: "POST",
				body: JSON.stringify({
					systolic: Number(systolic),
					diastolic: Number(diastolic),
					pulse: Number(pulse),
				}),
			});

			if (!res.ok) {
				throw new Error(data?.message || "Failed to save reading");
			}

			Alert.alert("Success", "Reading saved");
			router.back(); // go back to dashboard
		} catch (err) {
			Alert.alert("Error", err.message);
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Add Reading</Text>

			<TextInput
				style={styles.input}
				placeholder="Systolic"
				keyboardType="numeric"
				onChangeText={setSystolic}
			/>

			<TextInput
				style={styles.input}
				placeholder="Diastolic"
				keyboardType="numeric"
				onChangeText={setDiastolic}
			/>

			<TextInput
				style={styles.input}
				placeholder="Pulse"
				keyboardType="numeric"
				onChangeText={setPulse}
			/>

			<TouchableOpacity style={styles.button} onPress={save}>
				<Text style={styles.buttonText}>Save</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background,
		padding: 20,
		justifyContent: "center",
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		color: colors.dark,
		marginBottom: 20,
	},
	input: {
		backgroundColor: colors.card,
		padding: 14,
		borderRadius: 12,
		marginBottom: 12,
		borderWidth: 1,
		borderColor: "#E2E8F0",
	},
	button: {
		backgroundColor: colors.primary,
		padding: 16,
		borderRadius: 14,
		alignItems: "center",
	},
	buttonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "600",
	},
});
