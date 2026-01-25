import { View, Text, StyleSheet, Dimensions, ScrollView, RefreshControl, TouchableOpacity } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useQuery } from "@tanstack/react-query";
import api from "../src/api/api";
import { useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useAuthStore, useReadingsStore } from "../src/stores";
import { router } from "expo-router";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const fetchReadings = async () => {

  const { data } = await api.get("/readings/my");
  return data;
};

export default function Trends() {
  const [refreshing, setRefreshing] = useState(false);

  const { user } = useAuthStore();
  const { readings: storedReadings, setReadings } = useReadingsStore();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["readings", user?.id],
    queryFn: fetchReadings,
    staleTime: 5 * 60 * 1000,
    enabled: !!user,
  });

  const readings = data || storedReadings;

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const chartData = useMemo(() => {
    if (!readings?.length) return null;

    const sortedData = [...readings]
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .slice(-30);

    return {
      labels: sortedData.map((r, index) =>
        index % 5 === 0 || index === sortedData.length - 1
          ? new Date(r.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
          })
          : ""
      ),
      datasets: [
        {
          data: sortedData.map((r) => r.systolic),
          color: () => "#E11D48",
          label: "Systolic",
        },
        ...(sortedData[0]?.diastolic
          ? [
            {
              data: sortedData.map((r) => r.diastolic),
              color: () => "#3B82F6",
              label: "Diastolic",
            },
          ]
          : []),
      ],
    };
  }, [readings]);

  const chartHeight = Math.max(220, screenHeight * 0.35);

  const weeklyStats = useMemo(() => {
    if (!readings?.length) return null;
    const last7 = [...readings]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 7);

    const avgSystolic = last7.reduce((sum, r) => sum + r.systolic, 0) / last7.length;
    const avgDiastolic = last7.reduce((sum, r) => sum + (r.diastolic || 0), 0) / last7.length;
    const avgPulse = last7.reduce((sum, r) => sum + (r.pulse || 0), 0) / last7.length;

    return {
      avgSystolic: Math.round(avgSystolic),
      avgDiastolic: Math.round(avgDiastolic),
      avgPulse: Math.round(avgPulse),
    };
  }, [readings]);

  if (isLoading && !data) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <View style={styles.skeletonTitle} />
          <View style={styles.skeletonChart} />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.errorText}>Error loading data</Text>
          <Text style={styles.subText}>{error.message}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!data?.length) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.noDataText}>No readings available</Text>
          <Text style={styles.subText}>Add your first reading to see trends</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 80 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Animated.View entering={FadeInDown.duration(400)}>
          <Text style={styles.title}>Blood Pressure Trends</Text>
        </Animated.View>

        {chartData && (
          <Animated.View entering={FadeInUp.duration(500)} style={{ alignItems: "center" }}>
            <LineChart
              data={chartData}
              width={screenWidth - 40}
              height={chartHeight}
              yAxisSuffix=" mmHg"
              chartConfig={{
                backgroundColor: "#fff",
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#fff",
                decimalPlaces: 0,
                color: () => "#64748B",
                labelColor: () => "#64748B",
                propsForBackgroundLines: { stroke: "#E2E8F0" },
              }}
              bezier
              style={styles.chart}
              withVerticalLines={false}
              formatYLabel={(value) => Math.round(value)}
            />

            <View style={styles.legendContainer}>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: "#E11D48" }]} />
                <Text style={styles.legendText}>Systolic</Text>
              </View>
              {data[0]?.diastolic && (
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: "#3B82F6" }]} />
                  <Text style={styles.legendText}>Diastolic</Text>
                </View>
              )}
            </View>

            <Text style={styles.lastUpdated}>
              Showing last 30 readings • Updated{" "}
              {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </Text>

            {weeklyStats && (
              <Animated.View entering={FadeInUp.delay(600).duration(800)} style={styles.modernSummaryCard}>
                <View style={styles.cardAccent} />
                <View style={styles.cardContent}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.summaryTitle}>Last 7 Days Average</Text>
                    <View style={styles.statusBadge}>
                      <Text style={styles.statusText}>Stable</Text>
                    </View>
                  </View>
                  <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                      <Text style={styles.statLabel}>Blood Pressure</Text>
                      <Text style={styles.summaryValue}>
                        {weeklyStats.avgSystolic}
                        <Text style={styles.unitText}>/{weeklyStats.avgDiastolic}</Text>
                        <Text style={styles.mmhgText}> mmHg</Text>
                      </Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                      <Text style={styles.statLabel}>Avg. Pulse</Text>
                      <Text style={[styles.summaryValue, { color: '#EF4444' }]}>
                        {weeklyStats.avgPulse}
                        <Text style={styles.bpmText}> BPM</Text>
                      </Text>
                    </View>
                  </View>
                </View>
              </Animated.View>
            )}
          </Animated.View>
        )}
      </ScrollView>
      <TouchableOpacity onPress={() => router.replace("/")}>
        <Text style={styles.linkText}>Dashboard</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F8FAFC" },
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 20,
    marginTop: 20,
    marginHorizontal: 20,
    color: "#1E293B",
  },
  chart: {
    borderRadius: 16,
    marginBottom: 10,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  errorText: { fontSize: 18, color: "#DC2626", marginBottom: 8 },
  noDataText: { fontSize: 18, color: "#475569", marginBottom: 8 },
  subText: { fontSize: 14, color: "#94A3B8", textAlign: "center" },
  skeletonTitle: {
    height: 24,
    width: 200,
    backgroundColor: "#E2E8F0",
    borderRadius: 4,
    marginTop: 20,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  skeletonChart: { height: 220, backgroundColor: "#E2E8F0", borderRadius: 16, marginHorizontal: 20 },
  legendContainer: { flexDirection: "row", justifyContent: "center", marginTop: 10, marginBottom: 16 },
  legendItem: { flexDirection: "row", alignItems: "center", marginHorizontal: 12 },
  legendColor: { width: 12, height: 12, borderRadius: 6, marginRight: 6 },
  legendText: { fontSize: 12, color: "#64748B" },
  lastUpdated: { fontSize: 12, color: "#94A3B8", textAlign: "center", marginBottom: 20 },

  summaryCard: {
    backgroundColor: "#bebec0",
    padding: 20,
    borderRadius: 20,
    width: screenWidth - 40,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  summarySub: { fontSize: 16, fontWeight: "600", color: "#EF4444" },
  modernSummaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    width: screenWidth - 40,
    marginTop: 20,
    marginBottom: 40,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  cardAccent: {
    width: 6,
    backgroundColor: "#0dbb78c4",
  },
  cardContent: {
    flex: 1,
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
  },
  statusBadge: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#0F172A",
    textTransform: 'uppercase',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: "#94A3B8",
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1E293B",
  },
  unitText: {
    color: "#94A3B8",
    fontWeight: "400",
  },
  mmhgText: {
    fontSize: 12,
    color: "#94A3B8",
    fontWeight: "600",
  },
  bpmText: {
    fontSize: 12,
    fontWeight: "600",
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: "#E2E8F0",
    marginHorizontal: 15,
  },
  linkText: {
    color: "#64748B",
    textAlign: "center",
    fontSize: 15,
    marginBottom: 20
  },
});