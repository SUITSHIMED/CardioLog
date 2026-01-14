import { View, Text, StyleSheet, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useQuery } from "@tanstack/react-query";
import api from "../src/api/api";

const screenWidth = Dimensions.get("window").width;

const fetchReadings = async () => {
  const res = await api.fetchWithAuth("/readings");
  if (!res.res.ok) throw new Error("READINGS_ERROR");
  return res.data;
};

export default function Trends() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["readings"],
    queryFn: fetchReadings,
  });

  if (isLoading) {
    return <Text style={styles.center}>Loading trends...</Text>;
  }

  if (error || !data?.length) {
    return <Text style={styles.center}>No data available</Text>;
  }

  const chartData = {
    labels: data.map(r =>
      new Date(r.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      })
    ),
    datasets: [
      {
        data: data.map(r => r.systolic),
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Blood Pressure Trends</Text>

      <LineChart
        data={chartData}
        width={screenWidth - 40}
        height={220}
        yAxisSuffix=" mmHg"
        chartConfig={{
          backgroundColor: "#fff",
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          decimalPlaces: 0,
          color: () => "#E11D48",
          labelColor: () => "#64748B",
        }}
        bezier
        style={styles.chart}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F8FAFC" },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 20 },
  chart: { borderRadius: 16 },
  center: { textAlign: "center", marginTop: 40 },
});
