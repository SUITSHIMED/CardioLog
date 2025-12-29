import { View, TextInput, Alert, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const res = await fetch("http://192.168.1.103:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error("Login failed");
      const data = await res.json();
      await AsyncStorage.setItem("userId", data.userId);
      router.replace("/index");
    } catch (err) {
      Alert.alert("Error", "Invalid credentials");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CardioLog</Text>
      <TextInput style={styles.input} placeholder="Email" onChangeText={setEmail} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry onChangeText={setPassword} />
      
      <TouchableOpacity style={styles.button} onPress={login}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/register")}>
        <Text style={styles.linkText}>dont have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1,
     justifyContent: "center",
      padding: 20,
       backgroundColor: "#F9FAFB" },
  title: { fontSize: 32,
     fontWeight: "bold",
      color: "#E11D48",
       marginBottom: 40,
        textAlign: "center" },
  input: { backgroundColor: "#fff",
     padding: 15,
      borderRadius: 10,
       marginBottom: 15,
        borderWidth: 1,
         borderColor: "#E5E7EB" },
  button: { backgroundColor: "#E11D48",
     padding: 15,
      borderRadius: 10,
       alignItems: "center" },
  buttonText: { color: "#fff",
     fontSize: 18,
      fontWeight: "600" },
  linkText: { color: "#4B5563",
    marginTop: 20,
     textAlign: "center" }
});