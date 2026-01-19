import { View, TextInput, Alert, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useAuthStore } from "../src/stores";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Get login method from Zustand auth store
  const { login: storeLogin, isLoading } = useAuthStore();

  const login = async () => {
    try {
      // Call Zustand's login method which handles auth state automatically
      await storeLogin(email, password);
      // Redirect to dashboard after successful login
      router.replace("/");
    } catch (err) {
      console.error("Login Error Details:", err);
      Alert.alert("Error", err.message);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>CardioLog</Text>
      <TextInput style={styles.input} placeholder="Email" onChangeText={setEmail} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry onChangeText={setPassword} />
      
      <TouchableOpacity style={styles.button} onPress={login} disabled={isLoading}>
        <Text style={styles.buttonText}>{isLoading ? "Logging in..." : "Login"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/register")}>
        <Text style={styles.linkText}>dont have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles =  StyleSheet.create({
  container: { flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#F8FAFC" },

  brandArea: { alignItems: 'center', 
    marginBottom: 40 },
  title: { fontSize: 40,
    fontWeight: "900",
    color: "#E11D48",
    letterSpacing: -1 },
  tagline: { fontSize: 16,
     color: "#64748B",
      marginTop: 4 },
  card: { backgroundColor: '#fff', 
     padding: 24,
     borderRadius: 24,
     shadowColor: '#000',
     shadowOpacity: 0.1,
     shadowRadius: 10,
     elevation: 5 },
  input: { 
    backgroundColor: "#F1F5F9",
     padding: 16, 
     borderRadius: 12, 
    marginBottom: 15, 
    borderWidth: 1, 
    borderColor: "#E2E8F0",
     fontSize: 16 
  },
  button: { backgroundColor: "#E11D48",
     padding: 18, 
     borderRadius: 12,
      alignItems: "center",
       marginTop: 10 },
  buttonText: { color: "#fff",
     fontSize: 18,
      fontWeight: "700" },
  linkText: { color: "#64748B",
     marginTop: 25,
      textAlign: "center",
       fontWeight: '600' }
});