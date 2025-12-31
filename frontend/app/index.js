import { View, Text, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import authService from "../src/services/authService";
import { useRouter } from "expo-router";


export default function Dashboard() {
   const [user, setUser] = useState(null);
   const router = useRouter();


  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await authService.getToken();

        if (!token) {
          router.replace("/login");
          return;
        }

        const data = await authService.me();
        console.log("ME:", data);

        setUser(data);
      } catch (error) {
        console.log("DASHBOARD ERROR:", error.message);
        await authService.logout();
        router.replace("/login");
      }
    };

    loadUser();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.emoji}>❤️</Text>
       <Text style={styles.welcome}>
  Welcome {user?.email}
</Text>
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