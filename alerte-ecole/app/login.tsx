// app/login.tsx
import { Link, useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth } from "../services/firebase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/"); // redirige vers la page principale
    } catch (err: any) {
      Alert.alert("Erreur", err.message || "Identifiants invalides");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.appName}>🚨 Alerte École</Text>
      <View style={styles.card}>
        <Text style={styles.title}>Connexion</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Se connecter</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.registerButton]}
          onPress={() => router.replace("/register")}
        >
          <Text style={styles.buttonText}>Créer un compte</Text>
        </TouchableOpacity>

        <Link href="/register">
          <Text style={styles.link}>Pas encore de compte ? Inscrivez-vous</Text>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#f1faee" },
  appName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#e63946",
    marginBottom: 30,
    letterSpacing: 1,
    textShadowColor: "#fff",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
    alignItems: "center",
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, color: "#1d3557" },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: "#f8f9fa",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#1d3557",
    padding: 15,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginTop: 8,
  },
  registerButton: {
    backgroundColor: "#457b9d",
    marginTop: 12,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  link: { marginTop: 15, color: "#457b9d", fontWeight: "bold" },
});
