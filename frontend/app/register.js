import { View, TextInput, Alert, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from "react-native";
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