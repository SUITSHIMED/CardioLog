import { View, TextInput, Button, Alert, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const register = async () => {
    // Validation
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
      const res = await fetch("http://192.168.1.103:3000/api/auth/register", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ 
          email: email.trim(), 
          password: password.trim(), 
          name: name.trim() 
        }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        Alert.alert("Success", "Account created successfully!");
        router.replace("/login");
      } else {
        Alert.alert("Registration Failed", data.message || "Please try again");
      }
    } catch (err) {
      console.error("Registration error:", err);
      Alert.alert("Network Error", "Cannot connect to server. Check your connection and server URL.");
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
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#F9FAFB" 
  },
  title: { 
    fontSize: 28,
    fontWeight: "bold",
    color: "#E11D48",
    marginBottom: 30, 
    textAlign: "center" 
  },
  input: { 
    backgroundColor: "#fff", 
    padding: 15, 
    borderRadius: 10,
    marginBottom: 15, 
    borderWidth: 1,
    borderColor: "#E5E7EB" 
  },
  button: { 
    backgroundColor: "#E11D48",
    padding: 15,
    borderRadius: 10, 
    alignItems: "center",
    marginTop: 10 
  },
  buttonDisabled: {
    backgroundColor: "#FCA5A5",
  },
  buttonText: { 
    color: "#fff",
    fontSize: 18,
    fontWeight: "600" 
  },
  linkText: { 
    color: "#4B5563", 
    marginTop: 20, 
    textAlign: "center" 
  }
});