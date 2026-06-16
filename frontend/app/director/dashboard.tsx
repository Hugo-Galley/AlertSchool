import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ALERT_BY_TYPE } from "../../constants/alerts";
import { api } from "../../services/api";
import { useAuth } from "../../services/authContext";
import { startSignal, stopSignal } from "../../services/signal";
import { connectAlerts } from "../../services/websocket";

export default function DirectorDashboard() {
  const { signOut, user } = useAuth();
  const router = useRouter();
  const [activeType, setActiveType] = useState<string | null>(null);
  const activeIdRef = useRef<number | null>(null);

  useEffect(() => {
    let close: (() => void) | undefined;
    connectAlerts((e) => {
      if (e.event === "new_alert") {
        activeIdRef.current = e.alert.id;
        setActiveType(e.alert.type);
        startSignal(e.alert.type);
      } else if (e.event === "stop_alert") {
        activeIdRef.current = null;
        setActiveType(null);
        stopSignal();
      }
    }).then((c) => (close = c));

    return () => {
      close?.();
      stopSignal();
    };
  }, []);

  const handleStop = async () => {
    const id = activeIdRef.current;
    setActiveType(null);
    stopSignal();
    if (id != null) {
      try {
        await api.post(`/alerts/${id}/stop`);
      } catch {
        // arrêt local déjà effectué
      }
    }
  };

  const activeCfg = activeType ? ALERT_BY_TYPE[activeType] : null;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>👨‍💼 Tableau de bord</Text>
      {user && <Text style={styles.subtitle}>{user.full_name}</Text>}

      {activeCfg ? (
        <View style={[styles.alertCard, { backgroundColor: activeCfg.color }]}>
          <Text style={styles.alertLabel}>ALERTE EN COURS</Text>
          <Text style={styles.alertType}>{activeCfg.label}</Text>
          <TouchableOpacity style={styles.stopButton} onPress={handleStop}>
            <Text style={styles.stopButtonText}>🛑 Stopper l'alerte</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.calmCard}>
          <Text style={styles.calmText}>✅ Aucune alerte en cours</Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.navButton, { backgroundColor: "#1d3557" }]}
        onPress={() => router.push("/director/users")}
      >
        <Text style={styles.navButtonText}>👥 Gérer les enseignants</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.navButton, { backgroundColor: "#6c757d" }]}
        onPress={signOut}
      >
        <Text style={styles.navButtonText}>Déconnexion</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1faee",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  header: { fontSize: 26, fontWeight: "bold", color: "#1d3557" },
  subtitle: { fontSize: 15, color: "#6c757d", marginBottom: 28 },
  alertCard: {
    width: "100%",
    maxWidth: 480,
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    marginBottom: 28,
  },
  alertLabel: { color: "#fff", fontWeight: "bold", letterSpacing: 2, opacity: 0.9 },
  alertType: { color: "#fff", fontSize: 32, fontWeight: "bold", marginVertical: 12 },
  stopButton: {
    backgroundColor: "#000",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginTop: 8,
  },
  stopButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  calmCard: {
    width: "100%",
    maxWidth: 480,
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    marginBottom: 28,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d8f3dc",
  },
  calmText: { fontSize: 18, color: "#2a9d8f", fontWeight: "bold" },
  navButton: {
    width: "100%",
    maxWidth: 480,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  navButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
