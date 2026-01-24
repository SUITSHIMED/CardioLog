import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../src/api/api";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { Ionicons } from "@expo/vector-icons";

import { generateCardioReportHTML } from "../src/utils/pdf/cardioReportTemplate";

const SETTINGS_KEY = "app_settings";

export default function SettingsExport() {
  const [unit, setUnit] = useState("mmHg");
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(SETTINGS_KEY).then((stored) => {
      if (stored) {
        const parsed = JSON.parse(stored);
        setUnit(parsed.unit || "mmHg");
      }
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify({ unit }));
  }, [unit]);

  const { data: readings } = useQuery({
    queryKey: ["readings"],
    queryFn: async () => {
      const { data } = await api.get("/readings/my");
      return data;
    },
  });

  const handleExportPDF = async () => {
    if (!readings?.length) {
      Alert.alert("No data", "No readings to export");
      return;
    }

    setExporting(true);

    try {
      const html = generateCardioReportHTML({ readings, unit });
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri, {
        UTI: ".pdf",
        mimeType: "application/pdf",
      });
    } catch (error) {
      Alert.alert("Error", "Failed to generate PDF report");
      console.error(error);
    } finally {
      setExporting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings & Export</Text>
          <Text style={styles.subtitle}>
            Manage your preferences and clinical reports
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <View style={styles.iconText}>
                <Ionicons name="thermometer-outline" size={22} color="#E11D48" />
                <Text style={styles.label}>Blood Pressure Unit</Text>
              </View>

              <View style={styles.switchGroup}>
                <Text style={[styles.switchLabel, unit === "mmHg" && styles.activeLabel]}>
                  mmHg
                </Text>

                <Switch
                  value={unit === "kPa"}
                  onValueChange={(v) => setUnit(v ? "kPa" : "mmHg")}
                  trackColor={{ false: "#E2E8F0", true: "#E11D48" }}
                  thumbColor="#fff"
                />

                <Text style={[styles.switchLabel, unit === "kPa" && styles.activeLabel]}>
                  kPa
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Medical Report</Text>

          <TouchableOpacity
            style={[styles.exportButton, exporting && styles.disabledButton]}
            onPress={handleExportPDF}
            disabled={exporting}
            activeOpacity={0.8}
          >
            <Ionicons
              name="document-text"
              size={24}
              color="#fff"
              style={{ marginRight: 10 }}
            />
            <Text style={styles.exportButtonText}>
              {exporting ? "Generating PDF..." : "Export PDF Report"}
            </Text>
          </TouchableOpacity>

          <Text style={styles.note}>
            <Ionicons name="shield-checkmark" size={12} color="#94A3B8" />{" "}
            Your health data is processed locally for maximum privacy.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F8FAFC" },
  container: { padding: 24 },
  header: { marginBottom: 32 },
  title: { fontSize: 32, fontWeight: "800", color: "#1E293B", letterSpacing: -0.8 },
  subtitle: { fontSize: 16, color: "#64748B", marginTop: 4 },
  section: { marginBottom: 32 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#475569",
    marginBottom: 16,
    marginLeft: 4,
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 24,
    elevation: 4,
  },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  iconText: { flexDirection: "row", alignItems: "center" },
  label: { fontSize: 16, fontWeight: "600", color: "#334155", marginLeft: 12 },
  switchGroup: { flexDirection: "row", alignItems: "center" },
  switchLabel: { fontSize: 13, fontWeight: "600", color: "#94A3B8", marginHorizontal: 8 },
  activeLabel: { color: "#1E293B" },
  exportButton: {
    backgroundColor: "#E11D48",
    flexDirection: "row",
    padding: 18,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: { opacity: 0.6 },
  exportButtonText: { color: "#fff", fontSize: 18, fontWeight: "700" },
  note: {
    fontSize: 13,
    color: "#94A3B8",
    textAlign: "center",
    marginTop: 20,
    fontStyle: "italic",
  },
});
