import { View, Text, StyleSheet } from "react-native";

export default function Dashboard() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.emoji}>❤️</Text>
        <Text style={styles.welcome}>Welcome to CardioLog</Text>
        <Text style={styles.subtitle}>Your heart health journey starts here.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB", padding: 20, justifyContent: "center" },
  card: { backgroundColor: "#fff", padding: 30, borderRadius: 20, alignItems: "center", elevation: 3, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  emoji: { fontSize: 50, marginBottom: 10 },
  welcome: { fontSize: 22, fontWeight: "bold", color: "#111827" },
  subtitle: { fontSize: 16, color: "#6B7280", marginTop: 5, textAlign: "center" }
});