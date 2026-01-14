import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import authService from "../src/services/authService";
import { useRouter } from "expo-router";
import api from "../src/api/api";

export default function Dashboard() {
   const [user, setUser] = useState(null);
   const router = useRouter();
   const [stats, setStats] = useState(null);

 // Helper to determine BP category (UI logic only)
  const getStatus = (sys, dia) => {
    if (sys < 120 && dia < 80) return { label: "Normal", color: "#10B981" };
    if (sys < 130 && dia < 80) return { label: "Elevated", color: "#F59E0B" };
    return { label: "High", color: "#EF4444" };
  };


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

    const status = stats ? getStatus(stats.latest.systolic, stats.latest.diastolic) : null;
   return (
    <View style={styles.container}>
      {/* 1. Header Area */}
      <View style={styles.headerSection}>
        <Text style={styles.welcome}>Hello, {user?.email?.split('@')[0] || 'User'}</Text>
        <Text style={styles.subtitle}>Your heart health at a glance.</Text>
      </View>

      {/* 2. Primary Stats Card */}
      {stats && (
        <View style={styles.statsCard}>
          <View style={styles.statsHeader}>
            <Text style={styles.statTitle}>Latest Reading</Text>
            {status && (
              <View style={[styles.statusBadge, { backgroundColor: status.color + '20' }]}>
                <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
              </View>
            )}
          </View>
          
          <Text style={styles.statValue}>
            {stats.latest.systolic}<Text style={styles.unit}>/{stats.latest.diastolic}</Text>
          </Text>
          <Text style={styles.statSub}>❤️ {stats.latest.pulse} BPM</Text>

          <View style={styles.divider} />

          <View style={styles.grid}>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Average BP</Text>
              <Text style={styles.gridValue}>{Math.round(stats.stats.avgSystolic)}/{Math.round(stats.stats.avgDiastolic)}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Avg. Pulse</Text>
              <Text style={styles.gridValue}>{Math.round(stats.stats.avgPulse)} <Text style={styles.gridUnit}>bpm</Text></Text>
            </View>
          </View>
        </View>
      )}

      {/* 3. NEW: Health Insights Section (Fills the empty space) */}
      <View style={styles.insightSection}>
        <Text style={styles.sectionTitle}>Daily Insights</Text>
        <View style={styles.insightCard}>
          <View style={styles.insightIconContainer}>
            <Text style={{fontSize: 20}}>💡</Text>
          </View>
          <View style={styles.insightTextContainer}>
            <Text style={styles.insightTitle}>Health Tip</Text>
            <Text style={styles.insightDesc}>Reducing salt intake to less than 5g daily helps lower blood pressure.</Text>
          </View>
        </View>
        
        <View style={styles.activityRow}>
            <View style={styles.activityBox}>
                <Text style={styles.activityNumber}>{stats?.stats?.count || 0}</Text>
                <Text style={styles.activityLabel}>Total Logs</Text>
            </View>
            <View style={styles.activityBox}>
                <Text style={styles.activityNumber}>0</Text>
                <Text style={styles.activityLabel}>This Week</Text>
            </View>
        </View>
      </View>

      {/* 4. Bottom Actions */}
      <View style={styles.menuSection}>
        <TouchableOpacity style={styles.primaryButton} onPress={() => router.push("/add-reading")}>
          <Text style={styles.primaryButtonText}>+ New Reading</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push("/history")}>
          <Text style={styles.secondaryButtonText}>View History</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logout} onPress={async () => { await authService.logout(); router.replace("/login"); }}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC", paddingHorizontal: 24, paddingTop: 50 },
  headerSection: { marginBottom: 24 },
  welcome: { fontSize: 28, fontWeight: "800", color: "#1E293B" },
  subtitle: { fontSize: 16, color: "#64748B", marginTop: 4 },
  
  // Stats Card
  statsCard: { backgroundColor: "#1E293B", borderRadius: 28, padding: 24, elevation: 8 },
  statsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statTitle: { color: "#94A3B8", fontWeight: "600", textTransform: 'uppercase', letterSpacing: 1, fontSize: 12 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 12, fontWeight: "700" },
  statValue: { fontSize: 48, fontWeight: "800", color: "#FFFFFF", marginVertical: 8 },
  unit: { fontSize: 24, color: "#94A3B8" },
  statSub: { color: "#E11D48", fontSize: 18, fontWeight: "600" },
  divider: { height: 1, backgroundColor: "#334155", marginVertical: 20 },
  grid: { flexDirection: 'row' },
  gridItem: { flex: 1 },
  gridLabel: { color: "#94A3B8", fontSize: 11, marginBottom: 4, textTransform: 'uppercase' },
  gridValue: { color: "#FFFFFF", fontSize: 18, fontWeight: "700" },
  gridUnit: { fontSize: 12, fontWeight: '400' },

  // Insight Section (The new stuff)
  insightSection: { marginTop: 30 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#1E293B", marginBottom: 15 },
  insightCard: { 
    backgroundColor: "#FFFFFF", 
    padding: 16, 
    borderRadius: 20, 
    flexDirection: 'row', 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  insightIconContainer: { width: 45, height: 45, backgroundColor: '#FEF3C7', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  insightTextContainer: { marginLeft: 15, flex: 1 },
  insightTitle: { fontSize: 14, fontWeight: "700", color: "#1E293B" },
  insightDesc: { fontSize: 13, color: "#64748B", marginTop: 2, lineHeight: 18 },
  
  activityRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 },
  activityBox: { 
    backgroundColor: "#FFFFFF", 
    width: '48%', 
    padding: 15, 
    borderRadius: 20, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  activityNumber: { fontSize: 20, fontWeight: "800", color: "#1E293B" },
  activityLabel: { fontSize: 12, color: "#94A3B8", marginTop: 2 },

  // Buttons
  menuSection: { marginTop: 'auto', marginBottom: 30 },
  primaryButton: { backgroundColor: "#E11D48", padding: 18, borderRadius: 18, alignItems: "center", marginBottom: 12 },
  primaryButtonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  secondaryButton: { backgroundColor: "#fff", padding: 18, borderRadius: 18, alignItems: "center", borderWidth: 1, borderColor: "#E2E8F0" },
  secondaryButtonText: { color: "#1E293B", fontSize: 16, fontWeight: "700" },
  logout: { marginTop: 15, alignItems: 'center' },
  logoutText: { color: "#94A3B8", fontWeight: "600", fontSize: 14 }
});