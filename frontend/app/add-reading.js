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
            <View style={styles.header}>
			    <Text style={styles.title}>New Reading</Text>
                <Text style={styles.desc}>Enter your blood pressure details exactly as they appear on your monitor.</Text>
            </View>

            <View style={styles.form}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Systolic (Upper)</Text>
                    <TextInput style={styles.input} placeholder="120" keyboardType="numeric" onChangeText={setSystolic} />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Diastolic (Lower)</Text>
                    <TextInput style={styles.input} placeholder="80" keyboardType="numeric" onChangeText={setDiastolic} />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Pulse (BPM)</Text>
                    <TextInput style={styles.input} placeholder="72" keyboardType="numeric" onChangeText={setPulse} />
                </View>

                <TouchableOpacity style={styles.button} onPress={save}>
                    <Text style={styles.buttonText}>Save Reading</Text>
                </TouchableOpacity>
            </View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: "#FFFFFF", padding: 24 },
    header: { marginTop: 60, marginBottom: 40 },
	title: { fontSize: 32, fontWeight: "800", color: "#1E293B" },
    desc: { fontSize: 16, color: "#64748B", marginTop: 8, lineHeight: 22 },
    inputGroup: { marginBottom: 20 },
    label: { fontSize: 14, fontWeight: "700", color: "#475569", marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
	input: { 
        backgroundColor: "#F8FAFC", padding: 16, borderRadius: 14, 
        fontSize: 18, fontWeight: '600', color: '#1E293B',
        borderWidth: 1, borderColor: "#E2E8F0" 
    },
	button: { backgroundColor: "#E11D48", padding: 20, borderRadius: 16, alignItems: "center", marginTop: 20 },
	buttonText: { color: "#fff", fontSize: 18, fontWeight: "700" },
});