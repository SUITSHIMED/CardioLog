import { View, TextInput, Alert, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import authService from "../src/services/authService";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

 const login = async () => {
  try {
    await authService.login(email, password);
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