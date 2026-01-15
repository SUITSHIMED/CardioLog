import { View, Text, StyleSheet, Switch, Button, Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../src/api/api";

const SETTINGS_KEY = "app_settings";

export default function SettingsExport() {
  const [unit, setUnit] = useState("mmHg");
  const [exportFormat, setExportFormat] = useState("csv");

  /* ---------------- LOAD SETTINGS ---------------- */
  useEffect(() => {
    AsyncStorage.getItem(SETTINGS_KEY).then((stored) => {
      if (stored) {
        const parsed = JSON.parse(stored);
        setUnit(parsed.unit || "mmHg");
        setExportFormat(parsed.exportFormat || "csv");
      }
    });
  }, []);

  /* ---------------- SAVE SETTINGS ---------------- */
  useEffect(() => {
    AsyncStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify({ unit, exportFormat })
    );
  }, [unit, exportFormat]);

  /* ---------------- FETCH READINGS ---------------- */
  const { data: readings } = useQuery({
    queryKey: ["readings"],
    queryFn: async () => {
      const res = await api.fetchWithAuth("/readings/my");
      if (!res.res.ok) throw new Error("Failed to load readings");
      return res.data;
    },
  });

  /* ---------------- EXPORT CSV ---------------- */
  const exportCSV = () => {
    if (!readings?.length) {
      Alert.alert("No data", "No readings to export");
      return;
    }

    const header = "Date,Systolic,Diastolic,Pulse\n";

    const rows = readings
      .map((r) => {
        const systolic =
          unit === "kPa" ? (r.systolic / 7.5).toFixed(1) : r.systolic;
        const diastolic =
          unit === "kPa" ? (r.diastolic / 7.5).toFixed(1) : r.diastolic;

        return `${new Date(r.createdAt).toISOString()},${systolic},${diastolic},${r.pulse || ""}`;
      })
      .join("\n");

    const csv = header + rows;

    console.log(csv); // TEMP: later we save/share
    Alert.alert("Export ready", "CSV generated (check console)");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Settings & Export</Text>

        {/* -------- SETTINGS -------- */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <View style={styles.row}>
            <Text>Blood pressure unit</Text>
            <Switch
              value={unit === "mmHg"}
              onValueChange={(v) => setUnit(v ? "mmHg" : "kPa")}
            />
          </View>

          <View style={styles.row}>
            <Text>Export format</Text>
            <Switch
              value={exportFormat === "csv"}
              onValueChange={(v) => setExportFormat(v ? "csv" : "pdf")}
            />
          </View>
        </View>

        {/* -------- EXPORT -------- */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Export Data</Text>

          <Button
            title={`Export as ${exportFormat.toUpperCase()}`}
            onPress={exportCSV}
            color="#E11D48"
          />
        </View>

        {/* -------- INFO -------- */}
        <Text style={styles.note}>
          Your data stays on your device. Exporting generates a local report only.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F8FAFC" },
  container: { padding: 20 },
  title: { fontSize: 26, fontWeight: "700", marginBottom: 20 },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  note: {
    fontSize: 12,
    color: "#64748B",
    textAlign: "center",
    marginTop: 10,
  },
});
