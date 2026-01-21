import { View, TextInput, Alert, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import axios from "axios";

const BASE_URL = __DEV__
	? "http://192.168.1.136:3000/api" 
	: "https://cardiolog-production.up.railway.app/api";

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const register = async () => {
    
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    
    try {

      const { data } = await axios.post(`${BASE_URL}/auth/register`, {
        email: email.trim(), 
        password: password.trim(), 
        name: name.trim() 
      });
      
      Alert.alert("Success", "Account created successfully!");
      router.replace("/login");
    } catch (err) {
      console.error("Registration error:", err);
      const errorMsg = err.response?.data?.message || err.message || "Cannot connect to server";
      Alert.alert("Registration Failed", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      
      <TextInput 
        style={styles.input} 
        placeholder="Full Name" 
        value={name}
        onChangeText={setName}
        editable={!loading}
      />
      
      <TextInput 
        style={styles.input} 
        placeholder="Email" 
        value={email}
        onChangeText={setEmail} 
        keyboardType="email-address" 
        autoCapitalize="none"
        editable={!loading}
      />
      
      <TextInput 
        style={styles.input} 
        placeholder="Password (min 6 characters)" 
        value={password}
        secureTextEntry 
        onChangeText={setPassword}
        editable={!loading}
      />
      
      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={register}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign Up</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/login")} disabled={loading}>
        <Text style={styles.linkText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#F8FAFC", // Cleaner light gray/blue
    justifyContent: "center", 
    padding: 24 
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 24,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 5,
  },
  title: { 
    fontSize: 32, 
    fontWeight: "800", 
    color: "#1E293B", 
    textAlign: "center",
    letterSpacing: -0.5
  },
  subtitle: {
    fontSize: 16,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 32,
    marginTop: 8
  },
  inputGroup: {
    marginBottom: 16
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 8,
    marginLeft: 4
  },
  input: { 
    backgroundColor: "#F1F5F9", 
    padding: 16, 
    borderRadius: 12, 
    fontSize: 16,
    color: "#1E293B",
    borderWidth: 1,
    borderColor: "#E2E8F0"
  },
  button: { 
    backgroundColor: "#E11D48", 
    padding: 18, 
    borderRadius: 12, 
    alignItems: "center",
    marginTop: 12,
    shadowColor: "#E11D48",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  linkText: { color: "#64748B", marginTop: 24, textAlign: "center", fontSize: 15 }
});