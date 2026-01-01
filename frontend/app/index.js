import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import authService from "../src/services/authService";
import { useRouter } from "expo-router";
import api from "../src/api/api";


export default function Dashboard() {
   const [user, setUser] = useState(null);
   const router = useRouter();
   const [stats, setStats] = useState(null);



  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await authService.getToken();

        if (!token) {
          router.replace("/login");
          return;
        }
        const statsRes = await api.fetchWithAuth("/readings/stats");
if (statsRes.res.ok) {
  setStats(statsRes.data);
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
   <View style={styles.card}>
  <Text style={styles.emoji}>❤️</Text>
  <Text style={styles.welcome}>Welcome {user?.email}</Text>
  <Text style={styles.subtitle}>Your heart health journey starts here.</Text>
  {stats && (
  <View style={styles.statsCard}>
    <Text style={styles.statTitle}>Latest Reading</Text>
    <Text style={styles.statValue}>
      {stats.latest.systolic}/{stats.latest.diastolic}
    </Text>
    <Text style={styles.statSub}>❤️ {stats.latest.pulse} bpm</Text>

    <View style={styles.divider} />

    <Text style={styles.statSub}>
      Avg BP: {Math.round(stats.stats.avgSystolic)}/
      {Math.round(stats.stats.avgDiastolic)}
    </Text>
    <Text style={styles.statSub}>
      Avg Pulse: {Math.round(stats.stats.avgPulse)} bpm
    </Text>
  </View>
)}

  <TouchableOpacity 
    style={styles.addButton} 
    onPress={() => router.push("/add-reading")} >
    <Text style={styles.addButtonText}>+ Add New Reading</Text>
  </TouchableOpacity>
  <TouchableOpacity 
    style={styles.addButton} 
    onPress={() => router.push("/history")} >
    <Text style={styles.addButtonText}>History</Text>
  </TouchableOpacity>
  <TouchableOpacity
  style={styles.logout}
  onPress={async () => {
    await authService.logout();
    router.replace("/login");
  }}>

  <Text style={styles.logoutText}>Logout</Text>
</TouchableOpacity>
</View>


  );
}

const styles = StyleSheet.create({
  container: { flex: 1,
     backgroundColor: "#F9FAFB",
      padding: 20,
       justifyContent: "center" },
  card: { backgroundColor: "#fff",
     padding: 30, borderRadius: 20,
      alignItems: "center", elevation: 3,
       shadowColor: "#000",
        shadowOffset: { width: 0,
           height: 2 },
         shadowOpacity: 0.1,
          shadowRadius: 4 },
          
  emoji: { fontSize: 50,
     marginBottom: 10 },

  welcome: { fontSize: 22, 
    fontWeight: "bold",
     color: "#111827" },

  subtitle: { fontSize: 16,
     color: "#6B7280", 
     marginTop: 5, 
     textAlign: "center" },

     addButton: {
    marginTop: 20,
    backgroundColor: "#EF4444", 
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  statsCard: {
  backgroundColor: "#fff",
  padding: 20,
  borderRadius: 16,
  marginTop: 20,
},
statTitle: {
  fontSize: 16,
  fontWeight: "600",
  color: "#0D9488",
},
statValue: {
  fontSize: 28,
  fontWeight: "bold",
  marginVertical: 6,
},
statSub: {
  color: "#475569",
},
divider: {
  height: 1,
  backgroundColor: "#E5E7EB",
  marginVertical: 10,
},
logout: {
  marginTop: 30,
  padding: 14,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: "#EF4444",
},
logoutText: {
  textAlign: "center",
  color: "#EF4444",
  fontWeight: "600",
},


});