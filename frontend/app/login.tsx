// app/login.tsx
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../services/authContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erreur", "Email et mot de passe requis");
      return;
    }
    setLoading(true);
    try {
      const user = await signIn(email.trim(), password);
      router.replace(
        user.role === "director" ? "/director/dashboard" : "/(tabs)"
      );
    } catch (err: any) {
      const msg =
        err?.response?.status === 401
          ? "Identifiants invalides"
          : "Connexion au serveur impossible";
      Alert.alert("Erreur", msg);
    } finally {
      setLoading(false);
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
          keyboardType="email-address"
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
        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.6 }]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Connexion…" : "Se connecter"}
          </Text>
        </TouchableOpacity>
        <Text style={styles.hint}>
          Compte créé par le directeur de l'établissement.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f1faee",
  },
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
    maxWidth: 420,
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
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  hint: { marginTop: 16, color: "#6c757d", fontSize: 13, textAlign: "center" },
});
