import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore, useReadingsStore } from "../src/stores";
import api from "../src/api/api";

const getStatus = (sys, dia) => {
  if (sys < 120 && dia < 80) return { label: "Normal", color: "#10B981" };
  if (sys < 130 && dia < 80) return { label: "Elevated", color: "#F59E0B" };
  return { label: "High", color: "#EF4444" };
};

// Fetch stats from API
const fetchStats = async () => {
  try {
    const res = await api.fetchWithAuth("/readings/stats");
    if (!res.res.ok) throw new Error("STATS_ERROR");
    return res.data;
  } catch (error) {
    console.error("Stats error:", error);
    throw error;
  }
};

export default function Dashboard() {
  const router = useRouter();
  
  // Get user from Zustand auth store
  const { user, logout } = useAuthStore();
  
  // Get setStats from Zustand readings store
  const { setStats } = useReadingsStore();

  // Only fetch stats if user exists
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useQuery({
    queryKey: ["stats"],
    queryFn: fetchStats,
    enabled: !!user, 
  });

  // Handle errors - logout and redirect to login
  useEffect(() => {
    if (statsError) {
      logout();
      router.replace("/login");
    }
  }, [statsError, router, logout]);

  // Save stats to Zustand store when they load
  useEffect(() => {
    if (stats) {
      setStats(stats);
    }
  }, [stats, setStats]);

  // Show loading state
  if (!user || statsLoading) {
    return (
      <View style={styles.center}>
        <Text>Loading dashboard...</Text>
      </View>
    );
  }

  // Show error state
  if (statsError) {
    return null;
  }

  const status = getStatus(
    stats.latest.systolic,
    stats.latest.diastolic
  );

  return (
    <View style={styles.container}>
  
      <View style={styles.headerSection}>
        <Text style={styles.welcome}>
          Hello, {user.email.split("@")[0]}
        </Text>
        <Text style={styles.subtitle}>
          Your heart health at a glance.
        </Text>
      </View>

  
      <View style={styles.statsCard}>
        <View style={styles.statsHeader}>
          <Text style={styles.statTitle}>Latest Reading</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: status.color + "20" },
            ]}
          >
            <Text style={[styles.statusText, { color: status.color }]}>
              {status.label}
            </Text>
          </View>
        </View>

        <Text style={styles.statValue}>
          {stats.latest.systolic}
          <Text style={styles.unit}>/{stats.latest.diastolic}</Text>
        </Text>

        <Text style={styles.statSub}>
          ❤️ {stats.latest.pulse} BPM
        </Text>

        <View style={styles.divider} />

        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>Average BP</Text>
            <Text style={styles.gridValue}>
              {Math.round(stats.stats.avgSystolic)}/
              {Math.round(stats.stats.avgDiastolic)}
            </Text>
          </View>

          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>Avg. Pulse</Text>
            <Text style={styles.gridValue}>
              {Math.round(stats.stats.avgPulse)} bpm
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.menuSection}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push("/add-reading")}
        >
          <Text style={styles.primaryButtonText}>+ New Reading</Text>
        </TouchableOpacity>

        <View style={styles.row}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push("/history")}
          >
            <Text style={styles.secondaryButtonText}>View History</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push("/trends")}
          >
            <Text style={styles.secondaryButtonText}>View Trends</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.fullWidthButton}
          onPress={() => router.push("/profile")}
        >
          <Text style={styles.secondaryButtonText}>View Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.fullWidthButton}
          onPress={() => router.push("/settingsExport")}
        >
          <Text style={styles.secondaryButtonText}>Settings & Export</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.logout}
          onPress={async () => {
            await logout();
            router.replace("/login");
          }}
        >
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC", paddingHorizontal: 24, paddingTop: 50 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerSection: { marginBottom: 24 },
  welcome: { fontSize: 28, fontWeight: "800", color: "#1E293B" },
  subtitle: { fontSize: 16, color: "#64748B", marginTop: 4 },
  
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

  menuSection: { marginTop: 20, marginBottom: 30 },
  primaryButton: { backgroundColor: "#E11D48",
     padding: 18,
      borderRadius: 18,
       alignItems: "center",
        marginBottom: 12 },
  primaryButtonText: { color: "#fff", 
    fontSize: 16,
     fontWeight: "700" },
  row: { flexDirection: 'row',
     justifyContent: 'space-between',
      marginBottom: 12 },
  secondaryButton: { backgroundColor: "#fff",
     padding: 14,
      borderRadius: 12,
       alignItems: "center",
        borderWidth: 1,
         borderColor: "#E2E8F0",
          width: '48%' },
  fullWidthButton: { backgroundColor: "#fff", padding: 14, borderRadius: 12, alignItems: "center", borderWidth: 1, borderColor: "#E2E8F0", width: '100%', marginBottom: 12 },
  secondaryButtonText: { color: "#1E293B", fontSize: 15, fontWeight: "700" },
  logout: { marginTop: 6, alignItems: 'center' },
  logoutText: { color: "#94A3B8", fontWeight: "600", fontSize: 14 }
  
});