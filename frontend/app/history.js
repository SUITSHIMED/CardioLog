import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { useEffect, useState } from "react";
import { Swipeable } from "react-native-gesture-handler";
import api from "../src/api/api";
import { useReadingsStore } from "../src/stores";
import { getBPStatus } from "../src/utils/healthLogic";

export default function History() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { readings, setReadings } = useReadingsStore();

  // Load readings
  const loadReadings = async () => {
    try {
      const { data } = await api.get("/readings/my");
      setReadings(data);
    } catch (err) {
      console.error("Error loading readings:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadReadings();
  }, []);

  // Delete reading with confirmation
  const deleteReading = async (id) => {
    Alert.alert(
      "Delete Reading",
      "Are you sure you want to delete this reading?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/readings/${id}`);
              setReadings(readings.filter((r) => r.id !== id));
            } catch (err) {
              Alert.alert("Error", "Failed to delete reading.");
            }
          },
        },
      ]
    );
  };

  // Swipe delete UI
  const renderRightActions = (item) => (
    <View style={styles.deleteBox}>
      <Text
        style={styles.deleteText}
        onPress={() => deleteReading(item.id)}
      >
        Delete
      </Text>
    </View>
  );

  // Render each item
  const renderItem = ({ item }) => {
    const status = getBPStatus(item.systolic, item.diastolic);
    const dateObj = new Date(item.createdAt);

    return (
      <Swipeable
        renderRightActions={() => renderRightActions(item)}
        overshootRight={false}
      >
        <View style={styles.card}>
          <View
            style={[
              styles.leftBar,
              { backgroundColor: status.color },
            ]}
          />

          <View style={styles.mainInfo}>
            <Text style={styles.bp}>
              {item.systolic}
              <Text style={styles.slash}>/</Text>
              {item.diastolic}
              <Text style={styles.mmhg}> mmHg</Text>
            </Text>
            <Text style={styles.pulse}>
              ❤️ {item.pulse} BPM
            </Text>
          </View>

          <View style={styles.dateInfo}>
            <Text style={styles.dateText}>
              {dateObj.toLocaleDateString()}
            </Text>
            <Text
              style={[
                styles.statusLabel,
                { color: status.color },
              ]}
            >
              {status.label}
            </Text>
          </View>
        </View>
      </Swipeable>
    );
  };

  if (loading) {
    return (
      <ActivityIndicator
        style={styles.center}
        size="large"
        color="#E11D48"
      />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>History Log</Text>

      <FlatList
        data={readings}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadReadings();
            }}
          />
        }
        contentContainerStyle={{ paddingBottom: 40 }}
        ListEmptyComponent={
          <Text style={styles.empty}>
            No readings recorded yet.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1E293B",
    marginBottom: 24,
    marginTop: 40,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },

  leftBar: {
    width: 5,
    height: "100%",
    borderRadius: 3,
    marginRight: 16,
  },

  mainInfo: {
    flex: 1,
  },

  bp: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1E293B",
  },
  slash: {
    color: "#CBD5E1",
  },
  mmhg: {
    fontSize: 12,
    color: "#94A3B8",
    fontWeight: "400",
  },
  pulse: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 4,
    fontWeight: "600",
  },

  dateInfo: {
    alignItems: "flex-end",
  },
  dateText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E293B",
  },
  statusLabel: {
    fontSize: 11,
    fontWeight: "800",
    marginTop: 4,
    textTransform: "uppercase",
  },

  empty: {
    textAlign: "center",
    color: "#94A3B8",
    marginTop: 60,
    fontSize: 16,
  },

  deleteBox: {
    backgroundColor: "#E11D48",
    justifyContent: "center",
    alignItems: "center",
    width: 90,
    marginVertical: 6,
    borderRadius: 16,
  },
  deleteText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 14,
  },
});
