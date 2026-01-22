import { View, Text, StyleSheet, ScrollView, TextInput, Button, Alert } from "react-native";
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
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
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
        <Animated.Text
          entering={FadeInDown.duration(400)}
          style={styles.title}
        >
          Medical Profile
        </Animated.Text>

        <Animated.View
          entering={FadeInUp.delay(200).duration(600)}
          style={styles.card}
        >
          <Animated.View
            entering={FadeInDown.duration(400)}
            style={styles.inputGroup}
          >
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(value) => handleInputChange("name", value)}
              placeholder="Enter your name"
            />
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(50).duration(400)}
            style={styles.inputGroup}
          >
            <Text style={styles.label}>Age (years)</Text>
            <TextInput
              style={styles.input}
              value={formData.age}
              onChangeText={(value) => handleInputChange("age", value)}
              keyboardType="numeric"
              placeholder="Enter your age"
            />
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(100).duration(400)}
            style={styles.inputGroup}
          >
            <Text style={styles.label}>Weight (kg)</Text>
            <TextInput
              style={styles.input}
              value={formData.weight}
              onChangeText={(value) => handleInputChange("weight", value)}
              keyboardType="decimal-pad"
              placeholder="Enter your weight"
            />
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(150).duration(400)}
            style={styles.inputGroup}
          >
            <Text style={styles.label}>Height (cm)</Text>
            <TextInput
              style={styles.input}
              value={formData.height}
              onChangeText={(value) => handleInputChange("height", value)}
              keyboardType="decimal-pad"
              placeholder="Enter your height"
            />
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(200).duration(400)}
            style={styles.inputGroup}
          >
            <Text style={styles.label}>Blood Type</Text>
            <TextInput
              style={styles.input}
              value={formData.bloodType}
              onChangeText={(value) => handleInputChange("bloodType", value)}
              placeholder="e.g., O+, A-, B+, AB+"
            />
          </Animated.View>

          <Animated.View
            entering={FadeInUp.delay(400).duration(600)}
            style={styles.buttonContainer}
          >
            <Button
              title={mutation.isPending ? "Saving..." : "Save Changes"}
              onPress={handleSave}
              disabled={mutation.isPending}
              color="#0dbb78c4"
            />
          </Animated.View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F8FAFC" },
  scrollContent: { padding: 20, paddingBottom: 40 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { fontSize: 16, color: "#64748B", marginBottom: 10 },
  errorTitle: { fontSize: 18, fontWeight: "600", color: "#DC2626", marginBottom: 8 },
  errorText: { fontSize: 14, color: "#991B1B", textAlign: "center" },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 20, color: "#1E293B" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: "600", color: "#475569", marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: "#F8FAFC",
    fontSize: 15,
    color: "#1E293B",
  },
  buttonContainer: { marginTop: 24 },
});
