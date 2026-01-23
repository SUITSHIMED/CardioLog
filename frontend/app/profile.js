import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import api from "../src/api/api";
import { useAuthStore } from "../src/stores";

const fetchUserProfile = async () => {
  const { data } = await api.get("/auth/me");
  return data;
};

const updateUserProfile = async (newData) => {
  const { data } = await api.put("/auth/me", newData);
  return data;
};

export default function MedicalProfile() {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    weight: "",
    height: "",
    bloodType: "",
  });

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchUserProfile,
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        age: profile.age ? profile.age.toString() : "",
        weight: profile.weight ? profile.weight.toString() : "",
        height: profile.height ? profile.height.toString() : "",
        bloodType: profile.bloodType || "",
      });
    }
  }, [profile]);

  const mutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (updatedProfile) => {
      setUser(updatedProfile);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      Alert.alert("Success", "Profile updated successfully!");
    },
    onError: (error) => {
      Alert.alert("Error", error.message);
    },
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const dataToSend = {
      name: formData.name,
      age: formData.age ? parseInt(formData.age, 10) : null,
      weight: formData.weight ? parseFloat(formData.weight) : null,
      height: formData.height ? parseFloat(formData.height) : null,
      bloodType: formData.bloodType,
    };

    mutation.mutate(dataToSend);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.errorTitle}>Error Loading Profile</Text>
          <Text style={styles.errorText}>{error.message}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Header */}
        <Animated.View entering={FadeInUp.duration(500)} style={styles.headerCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {formData.name ? formData.name[0].toUpperCase() : "U"}
            </Text>
          </View>

          <View>
            <Text style={styles.headerName}>
              {formData.name || "Your Name"}
            </Text>
            <Text style={styles.headerSub}>Medical Profile</Text>
          </View>
        </Animated.View>

        {/* Card */}
        <Animated.View entering={FadeInUp.delay(200).duration(600)} style={styles.card}>

          <Text style={styles.sectionTitle}>Personal Info</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(v) => handleInputChange("name", v)}
              placeholder="John Doe"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Age (years)</Text>
            <TextInput
              style={styles.input}
              value={formData.age}
              onChangeText={(v) => handleInputChange("age", v)}
              keyboardType="numeric"
              placeholder="Age in years"
            />
          </View>

          <Text style={styles.sectionTitle}>Body Metrics</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Weight (kg)</Text>
            <TextInput
              style={styles.input}
              value={formData.weight}
              onChangeText={(v) => handleInputChange("weight", v)}
              keyboardType="decimal-pad"
              placeholder="Weight in kg"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Height (cm)</Text>
            <TextInput
              style={styles.input}
              value={formData.height}
              onChangeText={(v) => handleInputChange("height", v)}
              keyboardType="decimal-pad"
              placeholder="Height in cm"
            />
          </View>

          <Text style={styles.sectionTitle}>Medical Info</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Blood Type</Text>
            <TextInput
              style={styles.input}
              value={formData.bloodType}
              onChangeText={(v) => handleInputChange("bloodType", v)}
              placeholder="O+, A-, B+, AB+"
            />
          </View>

          <TouchableOpacity
            style={[
              styles.saveButton,
              mutation.isPending && { opacity: 0.6 },
            ]}
            onPress={handleSave}
            disabled={mutation.isPending}
          >
            <Text style={styles.saveButtonText}>
              {mutation.isPending ? "Saving..." : "Save Changes"}
            </Text>
          </TouchableOpacity>

        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F8FAFC" },
  scrollContent: { padding: 20, paddingBottom: 40 },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { fontSize: 16, color: "#64748B" },
  errorTitle: { fontSize: 18, fontWeight: "600", color: "#DC2626" },
  errorText: { fontSize: 14, color: "#991B1B", marginTop: 6 },

  headerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0DBB78",
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
  },
  headerName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  headerSub: {
    fontSize: 13,
    color: "#E6FFFA",
    marginTop: 2,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F766E",
    marginBottom: 12,
    marginTop: 6,
  },

  inputGroup: { marginBottom: 16 },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#F9FAFB",
    fontSize: 15,
    color: "#1E293B",
  },

  saveButton: {
    backgroundColor: "#0DBB78",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 12,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
